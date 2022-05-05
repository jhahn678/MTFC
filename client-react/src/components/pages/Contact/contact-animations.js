export const headerVariants = {
    initial: {
        opacity: 1
    },
    animate: {
        opacity: 1,
        transition: {
        delay: .5,
        delayChildren: .3,
        staggerChildren: .1
        }
    }
}

export const letterVariants = {
    initial: {
      opacity: 0,
      y: -50
    },
    animate: {
      opacity: 1,
      y: 0
    }
}
  
export const imgVariants = {
    initial: {
        x: '-80vw',
        rotate: '180deg'
    },
    animate: {
        x: 0,
        rotate: '-30deg',
        transition: {
            duration: 1.5,
            type: 'spring'
        }
    }
}
  
export const envelopeVariants = {
    initial: {
        x: '30vw',
        y: '-50vh',
        rotate: '-180deg'
    },
    animate: {
        x: 0,
        y: 0,
        rotate: '30deg',
        transition: {
            duration: 1.5,
            type: 'spring'
        }
    },
    onSubmit: {
        x: '30vw',
        y: '-50vh',
        rotate: '-180deg',
        transition: {
            duration: 1.5,
            type: 'spring'
        }
    }
}

export const formVariants = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1
    },
    onSubmit: {
        transition: {
            delayChildren: .3,
            staggerChildren: .1
        }
    }
}

export const formItemVariants = {
    animate: {
        x: 0,
        height: '100%',
        transition: {
            duration: 1,
            ease: 'easeOut',
            type: 'spring'
        }
    },
    onSubmit: {
        x: '100vw',
        height: 0,
        transition: {
            duration: 1.5,
            ease: 'easeIn',
            type: 'spring'
        }
    }
}

export const formSubmittedVariants = {
    initial: {
        x: '-100vw'
    },
    animate: {
        x: '-100vw',
        transition: {
            duration: 1,
            ease: 'easeIn',
            type: 'spring'
        }
    },
    onSubmit: {
        x: 0,
        transition: {
            duration: .5,
            ease: 'easeOut',
            type: 'spring'
        }
    }
}