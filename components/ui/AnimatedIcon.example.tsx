// components/ui/AnimatedIcon.example.tsx
/**
 * EXAMPLES - Cách sử dụng AnimatedIcon component
 * 
 * File này chỉ để tham khảo, bạn có thể xóa sau khi đã hiểu cách dùng.
 */

'use client';

import AnimatedIcon from './AnimatedIcon';
// import heartAnimation from '@/public/animations/icons/heart.json';
// import mailAnimation from '@/public/animations/icons/envelope.json';
// import sparkleAnimation from '@/public/animations/icons/sparkle.json';

/**
 * EXAMPLE 1: Basic Usage - Loop animation
 */
export function Example1_BasicLoop() {
  // Uncomment sau khi download animation từ Flaticon:
  // return (
  //   <AnimatedIcon 
  //     animationData={heartAnimation}
  //     width={64}
  //     height={64}
  //     loop={true}
  //   />
  // );
  
  return <div className="text-gray-500">Download animation từ Flaticon trước</div>;
}

/**
 * EXAMPLE 2: Button với animated icon
 */
export function Example2_ButtonWithIcon() {
  // return (
  //   <button className="flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-lg hover:bg-pink-200">
  //     <AnimatedIcon 
  //       animationData={heartAnimation}
  //       width={24}
  //       height={24}
  //       loop={false}
  //     />
  //     <span>Like</span>
  //   </button>
  // );
  
  return null;
}

/**
 * EXAMPLE 3: Play once animation (success)
 */
export function Example3_PlayOnce() {
  // return (
  //   <AnimatedIcon 
  //     animationData={sparkleAnimation}
  //     width={80}
  //     height={80}
  //     loop={false}
  //     autoplay={true}
  //     stopAfterPlay={true}
  //     onComplete={() => console.log('Animation completed!')}
  //   />
  // );
  
  return null;
}

/**
 * EXAMPLE 4: Controlled play/pause
 */
export function Example4_Controlled() {
  // const [isPlaying, setIsPlaying] = useState(false);
  
  // return (
  //   <div>
  //     <button onClick={() => setIsPlaying(!isPlaying)}>
  //       {isPlaying ? 'Pause' : 'Play'}
  //     </button>
  //     <AnimatedIcon 
  //       animationData={heartAnimation}
  //       width={64}
  //       height={64}
  //       loop={true}
  //       autoplay={false}
  //       isPlaying={isPlaying}
  //     />
  //   </div>
  // );
  
  return null;
}

/**
 * EXAMPLE 5: Different sizes
 */
export function Example5_DifferentSizes() {
  // return (
  //   <div className="flex items-center gap-4">
  //     <AnimatedIcon animationData={heartAnimation} width={32} height={32} loop={true} />
  //     <AnimatedIcon animationData={heartAnimation} width={48} height={48} loop={true} />
  //     <AnimatedIcon animationData={heartAnimation} width={64} height={64} loop={true} />
  //   </div>
  // );
  
  return null;
}

/**
 * EXAMPLE 6: Speed control
 */
export function Example6_SpeedControl() {
  // return (
  //   <div className="flex items-center gap-4">
  //     <AnimatedIcon animationData={heartAnimation} width={64} height={64} speed={0.5} loop={true} />
  //     <AnimatedIcon animationData={heartAnimation} width={64} height={64} speed={1} loop={true} />
  //     <AnimatedIcon animationData={heartAnimation} width={64} height={64} speed={2} loop={true} />
  //   </div>
  // );
  
  return null;
}

/**
 * EXAMPLE 7: Trong Button component (tích hợp với UI system hiện tại)
 */
export function Example7_InButton() {
  // import Button from '@/components/ui/Button';
  // import { Heart } from 'lucide-react';
  
  // return (
  //   <Button 
  //     icon={
  //       <AnimatedIcon 
  //         animationData={heartAnimation}
  //         width={20}
  //         height={20}
  //         loop={false}
  //       />
  //     }
  //     iconPosition="left"
  //   >
  //     Send Love
  //   </Button>
  // );
  
  return null;
}

