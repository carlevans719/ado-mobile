import React from 'react';
import MarkdownRenderer from 'react-native-markdown-display';
import PropTypes from 'prop-types';

import getMarkdownIt from '../lib/markdown';
import styles from './Markdown.styles';

MarkdownRenderer.propTypes.markdownit = PropTypes.any;

const Markdown = ({ content }) => {
  const { md, rules } = getMarkdownIt(styles);

  return (
    <MarkdownRenderer style={styles} rules={rules} markdownit={md} mergeStyle={false}>{content}</MarkdownRenderer>
  );
};

export default Markdown;
