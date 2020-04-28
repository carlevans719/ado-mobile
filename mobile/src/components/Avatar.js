import React from 'react';
import { Avatar as PaperAvatar, withTheme } from 'react-native-paper';

const Text = withTheme(({ children, theme, ...props }) => {
  const customTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      primary: theme.colors.accent,
      text: theme.colors.onAccent,
    },
  };

  return (
    <PaperAvatar.Text theme={customTheme} {...props}>
      {children}
    </PaperAvatar.Text>
  );
});

export default {
  Text,
};
