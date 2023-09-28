import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import './Slide.css'

const Slide = (props) => {
    const { children, index } = props;
    const initState = {
        name: 'SlideVertical',
        localIndex: index,
        needCheck: true,
        next: false,
        start: {x: 0, y: 0, time: 0},
        move: {x: 0, y: 0},
        wrapper: {width: 0, height: 0, childrenLength: 0}
    }
    const [slideState, setSlideState] = useState(initState);
    const wrapperRef = useRef();
    const judgeValue = 20

    const canNext = (isNext) => {
        return !((slideState.localIndex === 0 && !isNext) || (slideState.localIndex === slideState.wrapper.childrenLength - 1 && isNext));
    }

    const touchStart = (e) => {
        // slideTouchStart(e, wrapperEl.value, state)
        wrapperRef.current.style.transitionDuration = "0ms";
        setSlideState({
            ...slideState,
            start: {
                x: e.touches[0].pageX,
                y: e.touches[0].pageY,
                time: Date.now()
            }
        })
    };
    const touchMove = (e) => {
        const newState = {
            ...slideState,
            move: {
                x: e.touches[0].pageX - slideState.start.x,
                y: e.touches[0].pageY - slideState.start.y
            }
        }
        setSlideState(newState)
        let isNext = slideState.move.y < 0
        let canSlideRes = canSlide(slideState, judgeValue)
        if (!canNext?.(isNext, e)) return

        if (canSlideRes) {
            // Utils.$stopPropagation(e)
            e.stopPropagation();
            let t = getSlideDistance(newState) + (isNext ? judgeValue : -judgeValue)
            let dx2 = 0
            dx2 = t + newState.move.y
            // Utils.$setCss(el, 'transition-duration', `0ms`)
            // Utils.$setCss(el, 'transform', `translate3d(${dx1}px, ${dx2}px, 0)`)
            wrapperRef.current.style.transitionDuration = '0ms';
            wrapperRef.current.style.transform = `translate3d(${0}px, ${dx2}px, 0)`
          } else {
            // notNextCb?.()
          }
        console.log(isNext,canSlideRes,'touchMove')
    }
    const touchEnd = (e)=>{
        let isNext = slideState.move.y < 0
        if (!canNext?.(isNext)) return
        if (slideState.next) {
            // Utils.$stopPropagation(e)
            e.stopPropagation();
            let endTime = Date.now()
            let gapTime = endTime - slideState.start.time
            let distance = slideState.move.y
            let judgeValue = slideState.wrapper.height
            if (Math.abs(distance) < 20) gapTime = 1000
            if (Math.abs(distance) > (judgeValue / 3)) gapTime = 100
            if (gapTime < 150) {
              if (isNext) {
                // state.localIndex++
                setSlideState({
                    ...slideState,
                    localIndex: slideState.localIndex + 1
                })
            } else {
                // state.localIndex--
                setSlideState({
                    ...slideState,
                    localIndex: slideState.localIndex - 1
                })
            }
            wrapperRef.current.style.transitionDuration = '300ms';
            wrapperRef.current.style.transform = `translate3d(0,${getSlideDistance(slideState)}px, 0)`
              return 
            }
          }
    }

    const getSlideDistance = (state) => {
        return -state.localIndex * state.wrapper.height
    }

    const slideInit = (el , state) => {
        setSlideState({
            ...slideState,
            wrapper: {
                width: el.style.width,
                height: el.style.height,
                childrenLength: el.children.length
            }
        })
        let t = getSlideDistance(state);
        el.style.transform = `translate3d(${0}px, ${t}px, 0)`
    }

    const slideReset = (el, state) => {
        el.style.transitionDuration = '300ms';
        let t = getSlideDistance(state);
        el.style.transform = `translate3d(${0}px, ${t}px, 0)`;
        setSlideState({
            ...slideState,
            start: {
                x: 0,
                y: 0,
                time: 0
            },
            move: {
                x: 0,
                y: 0
            },
            next: false,
            needCheck: true
        })
    };

    const canSlide = (state, judgeValue) => {
        if (state.needCheck) {
            if (Math.abs(state.move.x) > judgeValue || Math.abs(state.move.y) > judgeValue) {
              let angle = (Math.abs(state.move.x) * 10) / (Math.abs(state.move.y) * 10)
              state.next = angle <= 1;
              // console.log(angle)
              state.needCheck = false
            } else {
              return false
            }
          }
          return state.next
    }

    useLayoutEffect(()=>{
        slideInit(wrapperRef.current, slideState);
      },[])
      
    return <div className='slide v'>
        <div className='slide-list flex-direction-column' ref={ref=>{
            if(!ref) return;
            wrapperRef.current = ref;
        }} onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={touchEnd}>
            {children}
        </div>
    </div>
}

const SlideItem = (props) => {
    const {children} = props;
    return <div className='slide-item'>{children}</div>
}

export { Slide, SlideItem }