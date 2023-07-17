"use client";
import { useRef, useEffect } from "react";

interface MouseEvent {
  movementY: number;
  clientX: number;
}

export default function Line() {
  // Define a reference to an SVGPathElement
  const path = useRef<SVGPathElement>(null);

  // Initialize progress, x, time, and reqId variables
  let progress = 0;
  let x = 0.5;
  let time = Math.PI / 2;
  let reqId: number | null = null;

  // Use the useEffect hook to set the path on component mount
  useEffect(() => {
    setPath(progress);
  }, []);

  // Define a function to set the path of the SVG element
  const setPath = (progress: number) => {
    // Get the width of the window
    const width = window.innerWidth * 1;

    // Set the "d" attribute of the SVG path element using a quadratic Bézier curve
    path.current?.setAttributeNS(
      null,
      "d",
      `M0 250 Q${width * x} ${250 + progress}, ${width} 250`
    );
  };

  // Define a linear interpolation function
  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  // Define a function to handle mouse enter events
  const manageMouseEnter = () => {
    // If there is an animation frame request, cancel it and reset the animation
    if (reqId) {
      cancelAnimationFrame(reqId);
      resetAnimation();
    }
  };

  // Define a function to handle mouse move events
  const manageMouseMove = (e: MouseEvent) => {
    // Get the movementY and clientX properties from the event object
    const { movementY, clientX } = e;

    // Get the bounding rectangle of the SVG path element
    const pathBound = path.current?.getBoundingClientRect();

    // If the bounding rectangle exists, update x and progress and set the path
    if (pathBound) {
      x = (clientX - pathBound.left) / pathBound.width;
      progress += movementY;
      setPath(progress);
    }
  };

  // Define a function to handle mouse leave events
  const manageMouseLeave = () => {
    // Start animating out
    animateOut();
  };

  // Define a function to animate out
  const animateOut = () => {
    // Calculate newProgress using sine of time
    const newProgress = progress * Math.sin(time);

    // Update progress using linear interpolation towards zero
    progress = lerp(progress, 0, 0.025);

    // Increment time by 0.2
    time += 0.2;

    // Set the path using newProgress
    setPath(newProgress);

    // If progress is greater than a threshold, request another animation frame,
    // otherwise reset the animation.
    if (Math.abs(progress) > 0.75) {
      reqId = requestAnimationFrame(animateOut);
    } else {
      resetAnimation();
    }
  };

  // Define a function to reset the animation variables
  const resetAnimation = () => {
    time = Math.PI / 2;
    progress = 0;
  };

  return (
    <div className="flex flex-col items-end w-fit">
      <div className="relative w-full h-px mb-5">
        <div
          onMouseEnter={() => {
            manageMouseEnter();
          }}
          onMouseMove={(e) => {
            manageMouseMove(e);
          }}
          onMouseLeave={() => {
            manageMouseLeave();
          }}
          className="relative z-10 h-10 w-full top-[-40px]"
        ></div>
        <svg className="absolute w-full h-[500px] top-[-250px]">
          <path
            ref={path}
            className="stroke-current text-white stroke-[1px] fill-none"
          ></path>
        </svg>
      </div>
      <div className="flex flex-col items-end w-3/5">
        <div className="flex justify-end">
          <p className="text-sm mt-2">Smart Development</p>
          <p className="text-4xl w-3/4 ml-8">
            Combining unique design and rich technology, we build digital
            products exactly as they were designed, without shortcuts or
            simplifications.
          </p>
        </div>
        <div className="flex mt-12">
          <p>Areas</p>
          <div className="flex w-full ml-8 flex-wrap gap-2.5">
            <p className="border border-white rounded-full uppercase text-lg py-2.5 px-3">
              E-commerce
            </p>
            <p className="border border-white rounded-full uppercase text-lg py-2.5 px-3">
              Finance
            </p>
            <p className="border border-white rounded-full uppercase text-lg py-2.5 px-3">
              Education
            </p>
            <p className="border border-white rounded-full uppercase text-lg py-2.5 px-3">
              Social
            </p>
            <p className="border border-white rounded-full uppercase text-lg py-2.5 px-3">
              Entertainment
            </p>
            <p className="border border-white rounded-full uppercase text-lg py-2.5 px-3">
              Medicine
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
