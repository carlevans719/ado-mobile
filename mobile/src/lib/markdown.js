import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableWithoutFeedback, ScrollView } from 'react-native';
import hasParents from 'react-native-markdown-display/src/lib/util/hasParents';
import textStyleProps from 'react-native-markdown-display/src/lib/data/textStyleProps';

import MarkdownIt from "markdown-it";
import MarkdownItTableOfContents from 'markdown-it-toc-done-right';
import markdownItTableAsColumnsPlugin from './markdownItTableAsColumnsPlugin';
import FitImage from '../components/FitImage';
import uuidv4 from './uuid';
import { openUrl } from './http';

const Table = ({ node, styles, children }) => {
  const [rowHeights, setRowHeights] = useState(new Array(node.children.length).fill([]));

  return (
    <ScrollView horizontal style={styles._VIEW_SAFE_table} contentContainerStyle={styles.tableContent}>
      {children.map(([Child, childProps], i) => {
        const onRowHeights = (rowHeight, columnNumber, rowNumber) => {
          const nextRowHeights = rowHeights.map(crh => crh.slice(0));
          const nextColumnRowHeights = nextRowHeights[columnNumber];

          nextColumnRowHeights[rowNumber] = rowHeight;

          for (let j = 0; j < nextRowHeights.length; j++) {
            nextRowHeights[j] = nextColumnRowHeights.slice(0);
          }

          if (JSON.stringify(rowHeights !== JSON.stringify(nextRowHeights))) {
            setRowHeights(nextRowHeights);
          }
        };

        return <Child {...childProps} rowHeights={rowHeights[i] || []} onRowHeights={onRowHeights} columnNumber={i} />;
      })}
    </ScrollView>
  );
};

const TableColumn = ({ rowHeights, onRowHeights, style, children, columnNumber }) => (
  <View style={style}>
    {children.map(([Child, childProps], rowNumber) => {
      const childStyle = [
        childProps.style,
        { minHeight: rowHeights[rowNumber] || 0 },
      ];
      
      const onLayout = layout => {
        if (Math.floor(layout.nativeEvent.layout.height) === Math.floor(rowHeights[rowNumber] || 0)) {
          return
        }

        onRowHeights(layout.nativeEvent.layout.height, columnNumber, rowNumber);
      }

      return <Child {...childProps} style={childStyle} onLayout={onLayout} />
    })}
  </View>
);

const TableCell = ({ style, onLayout, children }) => (
  <View onLayout={onLayout} style={style}>
    {children}
  </View>
);


const hasChild = (children, type) => {
  return children.findIndex(el => el.type === type || hasChild(el.children, type)) > -1;
};

function headings2ast (tokens) {
  const ast = { l: 0, n: '', c: [] }
  const stack = [ast]

  for (let i = 0, iK = tokens.length; i < iK; i++) {
    const token = tokens[i]
    if (token.type === 'heading_open') {
      const key = (
        tokens[i + 1]
          .children
          .filter(function (token) { return token.type === 'text' || token.type === 'code_inline' })
          .reduce(function (s, t) { return s + t.content }, '')
      )

      const node = {
        l: parseInt(token.tag.substr(1), 10),
        n: key,
        c: []
      }

      if (node.l > stack[0].l) {
        stack[0].c.push(node)
        stack.unshift(node)
      } else if (node.l === stack[0].l) {
        stack[1].c.push(node)
        stack[0] = node
      } else {
        while (node.l <= stack[0].l) stack.shift()
        stack[0].c.push(node)
        stack.unshift(node)
      }
    }
  }

  return ast
}

const getMarkdownIt = (styles) => {
  let ast;

  const rules = {
    bullet_list: (node, children, parent, styles) => {
      const nodeStyles = [styles.list, styles._VIEW_SAFE_bullet_list];

      if (hasParents(parent, 'ordered_list') || hasParents(parent, 'bullet_list')) {
        nodeStyles.push(styles.nestedList);
      }

      return (
        <View key={node.key} style={nodeStyles}>
          {children}
        </View>
      );
    },
    ordered_list: (node, children, parent, styles) => {
      const nodeStyles = [styles.list, styles._VIEW_SAFE_ordered_list];

      if (hasParents(parent, 'ordered_list') || hasParents(parent, 'bullet_list')) {
        nodeStyles.push(styles.nestedList);
      }

      return (
        <View key={node.key} style={nodeStyles}>
          {children}
        </View>
      );
    },
    list_item: (node, children, parent, styles, inheritedStyles = {}) => {
      // we need to grab any text specific stuff here that is applied on the list_item style
      // and apply it onto bullet_list_icon. the AST renderer has some workaround code to make
      // the content classes apply correctly to the child AST tree items as well
      // as code that forces the creation of the inheritedStyles object for list_items
      const refStyle = {
        ...inheritedStyles,
        ...StyleSheet.flatten(styles.list_item),
      };

      const arr = Object.keys(refStyle);

      const modifiedInheritedStylesObj = {};

      for (let b = 0; b < arr.length; b++) {
        if (textStyleProps.includes(arr[b])) {
          modifiedInheritedStylesObj[arr[b]] = refStyle[arr[b]];
        }
      }

      if (hasParents(parent, 'bullet_list')) {
        return (
          <View key={node.key} style={styles._VIEW_SAFE_list_item}>
            <Text style={[modifiedInheritedStylesObj, styles.bullet_list_icon]}>
              {Platform.select({
                android: '\u2022',
                ios: '\u00B7',
                default: '\u2022',
              })}
            </Text>
            <View style={[styles._VIEW_SAFE_bullet_list_content]}>{children}</View>
          </View>
        );
      }

      if (hasParents(parent, 'ordered_list')) {
        const orderedListIndex = parent.findIndex(
          el => el.type === 'ordered_list',
        );
  
        const orderedList = parent[orderedListIndex];
        let listItemNumber;
  
        if (orderedList.attributes && orderedList.attributes.start) {
          listItemNumber = orderedList.attributes.start + node.index;
        } else {
          listItemNumber = node.index + 1;
        }
  
        return (
          <View key={node.key} style={styles._VIEW_SAFE_list_item}>
            <Text style={[modifiedInheritedStylesObj, styles.ordered_list_icon]}>
              {listItemNumber + '.'}
              {node.markup}
            </Text>
            <View style={[styles._VIEW_SAFE_ordered_list_content]}>{children}</View>
          </View>
        );
      }

      return (
        <View key={node.key} style={[styles._VIEW_SAFE_list_item]}>
          {children}
        </View>
      );
    },  
    paragraph: (node, children, parent, styles) => {
      if (hasParents(parent, 'bullet_list')) {
        return (
          <View key={node.key} style={styles.bullet_list_item_text}>
            {children}
          </View>
        );
      }

      if (hasParents(parent, 'ordered_list')) {
        return (
          <View key={node.key} style={styles.ordered_list_item_text}>
            {children}
          </View>
        );
      }

      if (hasParents(parent, 'blockquote')) {
        const isLast = parent[0].children.length - 1 === node.index;
        return (
          <View key={node.key} style={[styles.blockquoteParagraph, ...(isLast ? [styles.blockquoteLastParagraph] : [])]}>
            {children}
          </View>
        );
      }

      return (
        <View key={node.key} style={styles._VIEW_SAFE_paragraph}>
          {children}
        </View>
      );
    },
    softbreak: (node, children, parent, styles) => {
      if (hasParents(parent, 'blockquote')) {
        return null;
      }

      return <Text key={node.key} style={styles.softbreak}>{' '}</Text>; // <Text key={node.key}>{'\n'}</Text>;
    },
    code_block: (node, children, parent, styles, inheritedStyles = {}) => {
      const nodeStyles = [inheritedStyles, styles.code_block];

      if (hasParents(parent, 'ordered_list') || hasParents(parent, 'bullet_list')) {
        nodeStyles.push(styles.nestedBlock);
      }

      return (
        <Text style={nodeStyles}>
          {node.content.replace(/\n+$/, '')}
        </Text>
      );
    },
    fence: (node, children, parent, styles, inheritedStyles = {}) => {
      const nodeStyles = [inheritedStyles, styles.code_block];

      if (hasParents(parent, 'ordered_list') || hasParents(parent, 'bullet_list')) {
        nodeStyles.push(styles.nestedBlock);
      }

      return (
        <Text key={node.key} style={nodeStyles}>
          {node.content.replace(/\n+$/, '')}
        </Text>
      );
    },
    link: (node, children, parent, styles) => {
      return (
        <Text key={node.key} style={styles.link} onPress={() => openUrl(node.attributes.href)}>
          {children}
        </Text>
      );
    },
    blocklink: (node, children, parent, styles) => {
      return (
        <TouchableWithoutFeedback key={node.key} onPress={() => openUrl(node.attributes.href)} style={styles.blocklink}>
          <View style={styles.image}>{children}</View>
        </TouchableWithoutFeedback>
      );
    },
    table: (node, children, parent, styles) => (
      <Table key={node.key} node={node} styles={styles} children={children} />
    ),
    tcol: (node, children, parent, styles, inheritedStyles = {}) => {
      const flatStyles = StyleSheet.flatten([inheritedStyles, styles.tcol]);

      if (hasChild(node.children, 'image')) {
        delete flatStyles.width;
        delete flatStyles.minWidth;
        delete flatStyles.maxWidth;
      }

      return [
        TableColumn,
        {
          key: node.key,
          style: flatStyles,
          children,
        },
      ];
    },
    td: (node, children, parent, styles, inheritedStyles = {}) => {
      return [
        TableCell,
        {
          key: node.key,
          style: [inheritedStyles, styles._VIEW_SAFE_td],
          children,
        },
      ];
    },
    th: (node, children, parent, styles, inheritedStyles = {}) => {
      return [
        TableCell,
        {
          key: node.key,
          style: [inheritedStyles, styles._VIEW_SAFE_th],
          children,
        },
      ];
    },
    image: (
      node,
      children,
      parent,
      styles,
      allowedImageHandlers,
      defaultImageHandler,
    ) => {
      const {src, alt} = node.attributes;

      // we check that the source starts with at least one of the elements in allowedImageHandlers
      const show =
        allowedImageHandlers.filter(value => {
          return src.toLowerCase().startsWith(value.toLowerCase());
        }).length > 0;
  
      if (show === false && defaultImageHandler === null) {
        return null;
      }
  
      const imageProps = {
        indicator: true,
        key: node.key,
        style: styles._VIEW_SAFE_image,
        source: {
          uri: show === true ? src : `${defaultImageHandler}${src}`,
        },
      };
  
      if (alt) {
        imageProps.accessible = true;
        imageProps.accessibilityLabel = alt;
      }

      return <FitImage {...imageProps} />;
    },
    tocOpen: (node, children) => {
      return (
        <View key={uuidv4()} style={styles.toc}>
          <Text style={styles.tocHeader}>Table of Contents</Text>
          {children}
        </View>
      );
    },
    tocClose: () => null,
    tocBody: (tokens, idx/* , options, env, renderer */) => {
      function ast2jsx (tree, isNested) {
        if (tree.c.length === 0) return null;

        return (
          <View key={uuidv4()} style={[styles.tocList, ...(isNested ? [styles.nestedTocList] : [])]}>
            {tree.c.map(node => (
              <React.Fragment key={uuidv4()}>

                {node.l > 1
                  ? (
                    <View style={styles.tocListItem}>
                      <Text style={styles.tocListItemIcon}>{'\u00B7'}</Text>
                      <Text style={styles.tocListItemText}>{node.n}</Text>
                    </View>
                  ) : null}

                {ast2jsx(node, true)}

              </React.Fragment>
            ))}
          </View>
        );
      }

      return ast2jsx(ast, false);
    }
  };

  const md = new MarkdownIt({
    linkify: true,
    typographer: true,
  });

  md.linkify.add('git:', 'http:')
  md.linkify.add('ftp:', null)
  md.linkify.set({ fuzzyIP: true })

  md.use(MarkdownItTableOfContents);
  md.use(markdownItTableAsColumnsPlugin);
  md.core.ruler.push('generateTocAst', function (state) {
    ast = headings2ast(state.tokens)
  });

  return { md, rules };
};

export default getMarkdownIt;
