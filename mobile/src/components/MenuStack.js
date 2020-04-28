import React from 'react';
import { View } from 'react-native';

class MenuStack extends React.Component {
  refMap = {};
  
  state = {
    stack: [],
  };

  componentDidMount () {
    this.push(this.props.initialComponentName);
  }
  
  push = (componentName) => {
    this.refMap[this.state.stack[this.state.stack.length - 1]]?.hide('left');
    this.refMap[componentName].show();
    this.setState(state => ({
      stack: [...state.stack, componentName],
    }));
  };

  pop = () => {
    this.refMap[this.state.stack[this.state.stack.length - 1]].hide('right');
    this.refMap[this.state.stack[this.state.stack.length - 2]].show();
    this.setState(state => ({
      stack: state.stack.slice(0, state.stack.length - 1),
    }));
  };

  render () {
    return (
      <View style={{ position: 'relative' }}>
        {this.props.items.map(({ Component, name, props }) => (
          <Component
            key={name}
            style={{ position: 'absolute', top: 0, left: 0 }}
            menuStackRef={this}
            ref={r => { this.refMap[name] = r; }}
            // {...props}
          />
        ))}
      </View>
    )
  }
}

export default MenuStack;
