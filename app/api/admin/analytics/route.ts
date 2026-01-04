// app/api/admin/analytics/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { serverLogger } from '@/lib/server-logger';

/**
 * GET /api/admin/analytics
 * Lấy dữ liệu analytics tổng hợp (chỉ admin)
 * Sử dụng admin client để bypass RLS
 */
export async function GET(req: Request) {
  const startTime = Date.now();
  try {
    serverLogger.logRequest('GET', '/api/admin/analytics');

    // 1. Verify user authentication
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      serverLogger.warn('Unauthorized GET admin/analytics', {});
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Kiểm tra quyền admin
    const { data: userData, error: userErr } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userErr || !userData || userData.role !== 'admin') {
      serverLogger.warn('Non-admin attempted to access admin/analytics', { userId: user.id });
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    // 3. Sử dụng admin client để bypass RLS
    const adminSupabase = createAdminClient();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    // Fetch all data in parallel
    const [
      usersRes,
      usersLastMonthRes,
      cardsRes,
      cardsLastMonthRes,
      cardsWithViewsRes,
      viewsLastMonthRes,
      draftsRes,
      recentCardsRes,
      recentUsersRes,
      usersTodayRes,
      usersThisWeekRes,
      usersThisMonthRes,
      cardsTodayRes,
      cardsThisWeekRes,
      cardsThisMonthRes,
      allUsersRes,
      allUsersPointsRes,
    ] = await Promise.all([
      // Current totals
      adminSupabase.from('users').select('*', { count: 'exact', head: true }),
      adminSupabase.from('users').select('id', { count: 'exact', head: true })
        .lt('created_at', monthAgo.toISOString()),
      adminSupabase.from('cards').select('id, view_count, created_at, recipient_name, sender_name, status'),
      adminSupabase.from('cards').select('id', { count: 'exact', head: true })
        .lt('created_at', monthAgo.toISOString()),
      adminSupabase.from('cards').select('id, view_count, created_at'),
      adminSupabase.from('cards').select('view_count')
        .lt('created_at', monthAgo.toISOString()),
      adminSupabase.from('card_drafts').select('id', { count: 'exact', head: true }),
      adminSupabase.from('cards').select('*').order('created_at', { ascending: false }).limit(10),
      adminSupabase.from('users').select('*').order('created_at', { ascending: false }).limit(10),
      // Time-based queries
      adminSupabase.from('users').select('id', { count: 'exact', head: true })
        .gte('created_at', today.toISOString()),
      adminSupabase.from('users').select('id', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString()),
      adminSupabase.from('users').select('id', { count: 'exact', head: true })
        .gte('created_at', monthAgo.toISOString()),
      adminSupabase.from('cards').select('id', { count: 'exact', head: true })
        .gte('created_at', today.toISOString()),
      adminSupabase.from('cards').select('id', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString()),
      adminSupabase.from('cards').select('id', { count: 'exact', head: true })
        .gte('created_at', monthAgo.toISOString()),
      // For top users calculation
      adminSupabase.from('users').select('id, name, email, points').limit(100),
      adminSupabase.from('users').select('points'),
    ]);

    // Calculate totals
    const cards = cardsRes.data ?? [];
    const totalViews = cards.reduce((sum: number, card: any) => sum + (card.view_count || 0), 0) || 0;
    const viewsLastMonth = (viewsLastMonthRes.data ?? []).reduce((sum: number, card: any) => sum + (card.view_count || 0), 0) || 0;
    const totalTym = (allUsersPointsRes.data || []).reduce((sum: number, u: any) => sum + (u.points || 0), 0) || 0;

    // Calculate growth
    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const usersGrowth = calculateGrowth(
      usersRes.count || 0,
      usersLastMonthRes.count || 0
    );
    const cardsGrowth = calculateGrowth(
      cards.length || 0,
      cardsLastMonthRes.count || 0
    );
    const viewsGrowth = calculateGrowth(totalViews, viewsLastMonth);

    // Get data by month
    const getDataByMonth = (data: any[], dateField: string = 'created_at'): Array<{ month: string; count: number; views: number }> => {
      const monthMap = new Map<string, number>();
      const now = new Date();
      const months: Array<{ month: string; count: number; views: number }> = [];
      
      // Tạo 6 tháng gần nhất
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
        months.push({ month: monthKey, count: 0, views: 0 });
        monthMap.set(monthKey, months.length - 1);
      }

      data.forEach((item: any) => {
        const date = new Date(item[dateField]);
        const monthKey = date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
        const index = monthMap.get(monthKey);
        if (index !== undefined) {
          months[index].count += 1;
          if (item.view_count) {
            months[index].views += item.view_count || 0;
          }
        }
      });

      return months;
    };

    // Get users by month
    const allUsersData = await adminSupabase.from('users').select('created_at');
    const usersByMonth = getDataByMonth(allUsersData.data || []);
    const cardsByMonth = getDataByMonth(cards, 'created_at');
    const viewsByMonth = getDataByMonth(cardsWithViewsRes.data || [], 'created_at').map((m) => ({
      month: m.month,
      views: m.views
    }));

    // Get top users
    let topUsers: Array<{ id: string; name: string; email: string; cards_count: number; views_count: number; points: number }> = [];
    if (allUsersRes.data && allUsersRes.data.length > 0) {
      const userCardCounts = await Promise.all(
        allUsersRes.data.map(async (user) => {
          const { count } = await adminSupabase
            .from('cards')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          const { data: userCards } = await adminSupabase
            .from('cards')
            .select('view_count')
            .eq('user_id', user.id);
          const viewsCount = (userCards || []).reduce((sum: number, c: any) => sum + (c.view_count || 0), 0);
          return {
            id: user.id,
            name: user.name || 'Không tên',
            email: user.email || '',
            cards_count: count || 0,
            views_count: viewsCount,
            points: user.points || 0
          };
        })
      );
      topUsers = userCardCounts
        .filter(u => u.cards_count > 0)
        .sort((a, b) => b.cards_count - a.cards_count)
        .slice(0, 10);
    }

    // Card status distribution
    const statusCounts = new Map<string, number>();
    cards.forEach((card: any) => {
      const status = card.status || 'draft';
      statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
    });
    const cardStatusDistribution = Array.from(statusCounts.entries()).map(([status, count]) => ({
      status: status === 'sent' ? 'Đã gửi' : status === 'viewed' ? 'Đã xem' : 'Nháp',
      count
    }));

    // Active users
    const { count: activeUsersCount } = await adminSupabase
      .from('cards')
      .select('user_id', { count: 'exact', head: true })
      .gte('created_at', monthAgo.toISOString());

    const duration = Date.now() - startTime;
    serverLogger.logRequest('GET', '/api/admin/analytics', {
      userId: user.id,
      duration,
    });

    return NextResponse.json({
      totalUsers: usersRes.count || 0,
      totalCards: cards.length || 0,
      totalViews,
      totalTym,
      totalDrafts: draftsRes.count || 0,
      recentCards: recentCardsRes.data || [],
      recentUsers: recentUsersRes.data || [],
      usersGrowth,
      cardsGrowth,
      viewsGrowth,
      usersByMonth,
      cardsByMonth,
      viewsByMonth,
      activeUsers: activeUsersCount || 0,
      newUsersToday: usersTodayRes.count || 0,
      newUsersThisWeek: usersThisWeekRes.count || 0,
      newUsersThisMonth: usersThisMonthRes.count || 0,
      cardsToday: cardsTodayRes.count || 0,
      cardsThisWeek: cardsThisWeekRes.count || 0,
      cardsThisMonth: cardsThisMonthRes.count || 0,
      topUsers,
      cardStatusDistribution
    }, { status: 200 });
  } catch (e: any) {
    serverLogger.logApiError('GET', '/api/admin/analytics', e);
    
    if (e?.message?.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return NextResponse.json({ 
        error: 'Server configuration error: Missing SUPABASE_SERVICE_ROLE_KEY. Please add this environment variable to enable admin features.' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}

