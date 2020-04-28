import React from 'react';
import { Button as PaperButton, withTheme } from 'react-native-paper'

const Button = ({ children, theme, ...props }) => {
  const customTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      primary: theme.colors.accent,
      text: theme.colors.onAccent,
    },
  };

  return (
    <PaperButton
      {...props}
      theme={customTheme}
    >
      {children}
    </PaperButton>
  );
};

export default withTheme(Button);
