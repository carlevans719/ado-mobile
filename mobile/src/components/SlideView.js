import React from 'react';
import { Animated } from 'react-native';

class SlideView extends React.Component {
  constructor (props) {
    super(props);

    const offsetLeft = -500 // should be own width
    const offsetRight = 500 // should be parent's width
    const initialPosition = props?.initialPosition || 'right';
    const initialOffset = initialPosition === 'center' ? 0 : initialPosition === 'left' ? offsetLeft : offsetRight;
    
    this.state = {
      offsetLeft,
      offsetRight,
      initialPosition,
      initialOffset,
      currentPosition: initialPosition,
      visible: initialPosition === 'center',
      transitioning: false,
      fadeAnim: new Animated.Value(initialOffset),
    };
  }

  show = () => {
    if (this.state.transitioning || this.state.visible) {
      return;
    }

    this.setState({
      transitioning: true,
    }, () => {
      Animated
        .spring(this.state.fadeAnim, {
          toValue: 0,
          useNativeDriver: true,
        })
        .start(({ finished }) => {
          this.setState({
            transitioning: false,
            currentPosition: 'center',
            visible: true,
          });
        });
    });
  };

  hide = (direction) => {
    if (this.state.transitioning || !this.state.visible) {
      return;
    }

    if (!direction) {
      direction = this.state.initialPosition;
    }

    this.setState({
      transitioning: true,
    }, () => {
      Animated
        .spring(this.state.fadeAnim, {
          toValue: direction === 'left' ? this.state.offsetLeft : this.state.offsetRight,
          useNativeDriver: true,
        })
        .start(({ finished }) => {
          this.setState({
            transitioning: false,
            currentPosition: direction,
            visible: false,
          });
        });
    });
  };

  render () {
    return (
      <Animated.View
        style={[
          this.props.style || {},
          {
            transform: [{
              translateX: this.state.fadeAnim,
            }],
          },
        ]}
      >
        {this.props?.children || null}
      </Animated.View>
    )
  }
}

export default SlideView;
