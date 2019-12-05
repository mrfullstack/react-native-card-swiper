import React, { Component } from 'react'
import { View, Text, Image, Animated, PanResponder, StyleSheet, Dimensions, ScrollView } from 'react-native'

//cats image
import Cat1 from '../assets/cat1.jpg'
import Cat2 from '../assets/cat2.jpg'
import Cat3 from '../assets/cat3.jpg'
import Cat4 from '../assets/cat4.jpg'
import Cat5 from '../assets/cat5.jpg'


import clamp from 'clamp'

const SWIPE_THRESHOLD = 120

class SwipeCard extends Component {
    state = {
        items: [
            {
                id: 1,
                image: Cat1,
                name: 'Smokey'
            },
            {
                id: 2,
                image: Cat2,
                name: 'Sassy'
            },
            {
                id: 3,
                image: Cat3,
                name: 'Sam'
            }, {
                id: 4,
                image: Cat4,
                name: 'Lucky'
            },
            {
                id: 5,
                image: Cat5,
                name: 'Kalu'
            }
        ],
        animation: new Animated.ValueXY(0),
        opacity: new Animated.Value(1),
        next: new Animated.Value(.9)
    }


    UNSAFE_componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: Animated.event([
                null,
                {
                    dx: this.state.animation.x,
                    dy: this.state.animation.y



                }
            ]),
            onPanResponderRelease: (e, { dx, vx, vy }) => {
                let velocity

                if (vx >= 0) {
                    velocity = clamp(vx, 3, 5)
                } else if (vx < 0) {
                    velocity = clamp(Math.abs(vx), 3, 5) * - 1
                }

                if (Math.abs(dx) > SWIPE_THRESHOLD) {
                    Animated.decay(this.state.animation, {
                        velocity: { x: velocity, y: vy },
                        deceleration: .98
                    }).start(this.transitionNext)
                } else {
                    Animated.spring(this.state.animation, {
                        toValue: { x: 0, y: 0 },
                        friction: 4
                    }).start()
                }
            }

        })
    }

    transitionNext = () => {
        Animated.parallel([
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 300
            }),
            Animated.spring(this.state.next, {
                toValue: 1,
                friction: 4
            })
        ]).start(() => {
            this.setState((state) => {
                return {
                    items: state.items.slice(1)
                }

            }, () => {
                this.state.next.setValue(.9)
                this.state.opacity.setValue(1)
                this.state.animation.setValue({ x: 0, y: 0 })
            })
        })

    }

    render() {
        const { animation } = this.state
        const rotate = animation.x.interpolate({
            inputRange: [-200, 0, 200],
            outputRange: ["-30deg", "0deg", "30deg"],
            extrapolate: 'clamp'
        })
        const opacity = animation.x.interpolate({
            inputRange: [-200, 0, 200],
            outputRange: [.5, 1, .5],
            extrapolate: 'clamp'
        })

        const animatedCardStyle = {
            opacity: this.state.opacity,
            transform: [
                {
                    rotate
                },
                ...this.state.animation.getTranslateTransform()
            ]
        }

        const animatedImageStyle = {
            opacity
        }

        //yes aimation
        yesOpacity = animation.x.interpolate({
            inputRange: [0, 150],
            outputRange: [0, 1]
        })
        yesScale = animation.x.interpolate({
            inputRange: [0, 150],
            outputRange: [0.5, 1],
            extrapolate: 'clamp'
        })

        animatedYupStyle = {
            transform: [
                {
                    scale: yesScale
                },
                {
                    rotate: "-30deg"
                },

            ],
            opacity: yesOpacity
        }

        //nope animation

        const nopeOpacity = animation.x.interpolate({
            inputRange: [-150, 0],
            outputRange: [1, 0]
        })

        const nopeScale = animation.x.interpolate({
            inputRange: [-150, 0],
            outputRange: [1, 0.5]
        })

        const animatedNopeStyle = {
            transform: [
                {
                    scale: nopeScale
                },
                {
                    rotate: "30deg"
                }
            ],
            opacity: nopeOpacity
        }

        return (
            <View style={styles.container}>

                <Animated.View style={[styles.top]}>
                    {
                        this.state.items.slice(0, 2).reverse().map(({ id, name, image }, index, items) => {
                            const isLastItem = index === items.length - 1
                            const is2ndLastItem = index === items.length - 2

                            const panHanlders = isLastItem ? this._panResponder.panHandlers : {}
                            const cardStyle = isLastItem ? animatedCardStyle : undefined
                            const imageStyle = isLastItem ? animatedImageStyle : undefined

                            const nextStyle = is2ndLastItem ? { transform: [{ scale: this.state.next }] } : undefined

                            return (
                                <Animated.View
                                    style={[styles.card, cardStyle, nextStyle]}
                                    key={id}
                                    {...panHanlders}>
                                    <Animated.Image
                                        source={image}
                                        style={[styles.image, imageStyle]}
                                        resizeMode="cover" />
                                    <View
                                        style={styles.lowerText}>
                                        <Text style={styles.cat_name}>{name}</Text>
                                    </View>
                                    {
                                        isLastItem && <Animated.View style={[styles.yup, animatedYupStyle]}>
                                            <Text style={styles.yupText}>Yup</Text>
                                        </Animated.View>
                                    }
                                    {
                                        isLastItem && <Animated.View style={[styles.nope, animatedNopeStyle]}>
                                            <Text style={styles.nopeText}>Nope</Text>
                                        </Animated.View>
                                    }

                                </Animated.View>
                            )
                        })
                    }
                </Animated.View>
                <Animated.View style={[styles.bottom]}>

                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    top: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    card: {
        width: 350,
        height: 600,
        position: 'absolute',
        borderRadius: 3,
        shadowColor: '#000',
        shadowOpacity: .1,
        shadowOffset: { x: 0, y: 0 },
        shadowRadius: 5,
        borderWidth: 1,
        borderColor: '#FFF',
        elevation: 2
    },
    image: {
        height: null,
        width: null,
        flex: 3,
        borderRadius: 2
    },
    cat_name: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 21
    },
    lowerText: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 5
    },
    yup: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 20,
        borderColor: 'green',
        borderWidth: 2,
        borderRadius: 5,
        backgroundColor: "#FFF"
    },
    yupText: {
        fontSize: 16,
        color: 'green'
    },
    nope: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 20,
        borderColor: 'red',
        borderWidth: 2,
        borderRadius: 5,
        backgroundColor: "#FFF"
    },
    nopeText: {
        fontSize: 16,
        color: 'red'
    }
})

export default SwipeCard