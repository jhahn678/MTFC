export const userSvgVariants = {
    initial: {
        x: '-100vw',
        rotate: '-180deg'
    },
    animate: {
        x: 0,
        rotate: '-10deg',
        transition: {
            duration: 1.5,
            type: 'spring'
        }
    }
  }
  
  export const padlockSvgVariants = {
    initial: {
        x: '100vw',
        rotate: '180deg'
    },
    animate: {
        x: 0,
        rotate: '10deg',
        transition: {
            duration: 1.5,
            type: 'spring'
        }
    }
  }