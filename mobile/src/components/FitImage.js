import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image as RNImage,
  StyleSheet,
} from 'react-native';
import CustomImage from './CustomImage';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class FitImage extends Component {
  ImageComponent = CustomImage;
  mounted = false;
  sizeStyle = {};

  constructor(props) {
    super(props);

    this.style = StyleSheet.flatten(props.style);

    if (this.style) {
      const size = [this.style.width, this.style.height];

      if (size.filter(Boolean).length === 1) {
        throw new Error('Props error: size props must be present ' +
                        'none or both of width and height.');
      }

      if (this.style.width) {
        this.sizeStyle = { width: this.style.width };
      } else {
        this.sizeStyle = { flexGrow: 1 };
      }
    }

    const originalSize = [props.originalWidth, props.originalHeight];
    if (originalSize.filter(Boolean).length === 1) {
      throw new Error('Props error: originalSize props must be present ' +
                      'none or both of originalWidth and originalHeight.');
    }

    this.isFirstLoad = true;

    this.state = {
      isLoading: false,
      layoutWidth: 0,
      originalHeight: 0,
      originalWidth: 0,
    };
  }

  componentDidMount() {
    this.mounted = true;

    if (this.props.originalWidth && this.props.originalHeight) {
      return;
    }

    this.fetchOriginalSizeFromRemoteImage();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const ImageComponent = this.ImageComponent;

    return (
      <ImageComponent
        {...this.props}
        onLayout={this.onLayout}
        onLoad={this.onLoad}
        onLoadStart={this.onLoadStart}
        onError={this.onError}
        source={this.props.source}
        style={[
          this.style,
          this.sizeStyle,
          { height: this.getHeight() },
          styles.container,
        ]}
      >
        {this.shouldDisplayIndicator() ? this.renderActivityIndicator() : this.props.children}
      </ImageComponent>
    );
  }

  shouldDisplayIndicator = () => {
    return this.state.isLoading && this.props.indicator !== false;
  }

  onLoad = () => {
    if (this.state.isLoading) {
      this.setState({ isLoading: false });
    }

    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad();
    }
  }

  onLoadStart = () => {
    if (this.isFirstLoad) {
      this.setState({ isLoading: true });
      this.isFirstLoad = false;
    }
  }

  onError = () => {
    if (this.state.isLoading) {
      this.setState({ isLoading: false });
    }
  }

  getHeight = () => {
    if (this.style && this.style.height) {
      return Number(this.style.height);
    }

    return Math.round(this.getOriginalHeight() * this.getRatio());
  }

  getOriginalHeight = () => (
    this.props.originalHeight || this.state.originalHeight || 0
  )

  getOriginalWidth = () => (
    this.props.originalWidth || this.state.originalWidth || 0
  )

  getRatio = () => {
    if (this.getOriginalWidth() === 0) {
      return 0;
    }

    return this.state.layoutWidth / this.getOriginalWidth();
  }

  onLayout = (event) => {
    const { width: layoutWidth } = event.nativeEvent.layout;

    this.setState({ layoutWidth });
  }

  fetchOriginalSizeFromRemoteImage = () => {
    let uri;

    if (this.props.source instanceof Array) {
      uri = this.props.source[0].uri;
    } else {
      uri = this.props.source.uri;
    }

    if (!uri) {
      return;
    }

    RNImage.getSize(
      uri,
      (originalWidth, originalHeight) => {
        if (!this.mounted) {
          return;
        }

        this.setOriginalSize(originalWidth, originalHeight);
      },
      () => null,
    );
  }

  setOriginalSize = (originalWidth, originalHeight) => {
    this.setState({
      originalHeight,
      originalWidth,
    });
  }

  renderActivityIndicator = () => {
    return (
      <ActivityIndicator
        color={this.props.indicatorColor}
        size={this.props.indicatorSize}
      />
    );
  }
}

export default FitImage;
