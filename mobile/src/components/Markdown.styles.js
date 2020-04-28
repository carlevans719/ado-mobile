import { StyleSheet } from 'react-native';

const BASE_FONT_SIZE = 17;
const REM = BASE_FONT_SIZE;
const COLOUR_HIGHLIGHT = 'rgba(190, 190, 190, 0.3)';
const COLOUR_HEADING = 'rgba(117, 117, 117, 1)';
const COLOUR_LINK = 'rgba(0, 90, 158, 1)';
const headerStyles = { fontWeight: 'bold', marginVertical: 1 * REM, paddingBottom: 0.333 * REM };

export default {
  body: { flex:1, paddingHorizontal: 0.333 * REM, fontSize: BASE_FONT_SIZE, fontFamily: 'WorkSans-Regular' },

  heading1: { ...headerStyles, fontSize: 1.833 * REM, borderBottomColor: COLOUR_HIGHLIGHT, borderBottomWidth: 1 },
  heading2: { ...headerStyles, fontSize: 1.666 * REM, borderBottomColor: COLOUR_HIGHLIGHT, borderBottomWidth: 1 },
  heading3: { ...headerStyles, fontSize: 1.5 * REM },
  heading4: { ...headerStyles, fontSize: 1.25 * REM },
  heading5: { ...headerStyles, fontSize: 1.333 * REM },
  heading6: { ...headerStyles, fontSize: 1.166 * REM, color: COLOUR_HEADING },

  hr: { borderBottomWidth: 3, borderBottomColor: COLOUR_HIGHLIGHT, marginBottom: 1 * REM },

  strong: { fontWeight: 'bold' },
  em: { fontStyle: 'italic' },
  s: { textDecorationLine: 'line-through' },

  blockquote: { borderLeftWidth: 3, borderLeftColor: COLOUR_HIGHLIGHT, paddingLeft: 0.666 * REM, marginBottom: 1 * REM, marginLeft: 1 * REM },
  // custom
  blockquoteParagraph: { marginBottom: 1 * REM },
  // custom
  blockquoteLastParagraph: { marginBottom: 0 },

  // custom
  nestedList: { marginBottom: 0 },
  bullet_list: { marginBottom: 1 * REM },
  ordered_list: { marginBottom: 1 * REM },
  list_item: { flexDirection: 'row', justifyContent: 'flex-start' },

  bullet_list_icon: { marginLeft: 1 * REM, marginRight: 0.333 * REM, fontWeight: 'bold', fontSize: 1.5 * REM, lineHeight: 1.666 * REM },
  bullet_list_content: { flex: 1, flexWrap:'wrap' },
  bullet_list_item_text: {},

  ordered_list_icon: { fontSize: BASE_FONT_SIZE, marginLeft: 1 * REM, marginRight: 0.333 * REM },
  ordered_list_content: { flex: 1, flexWrap:'wrap' },
  ordered_list_item_text: {},

  code_inline: { backgroundColor: COLOUR_HIGHLIGHT, fontFamily: 'Courier-Bold', fontStyle: 'italic' },
  code_block: { backgroundColor: COLOUR_HIGHLIGHT, padding: 0.666 * REM, fontFamily: 'Courier-Bold', marginBottom: 1 * REM },
  // custom
  nestedBlock: { marginTop: 0.666 * REM, marginBottom: 0.666 * REM },
  pre: {},

  table: {
    borderColor: '#E2E3E2',
    borderWidth: 1,
    borderRadius: 4,
  },
  tableContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 1,
  },
  tcol: {
    height: '100%',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 'auto',
    justifyContent: 'flex-start',
    maxWidth: 250,
  },
  th: {
    padding: 0.333 * REM,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 'auto',
    alignItems: 'center',
    minHeight: 30,
    borderBottomColor: '#E2E3E2',
    borderBottomWidth: 1,
    fontWeight: 'bold',
  },
  td: {
    padding: 0.333 * REM,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 'auto',
    alignItems: 'center',
    minHeight: 30,
  },  


  link: {
    textDecorationLine: 'underline',
    color: COLOUR_LINK,
  },
  blocklink: {
    flex: 1,
    borderColor: '#000000',
    borderBottomWidth: 1,
  },

  image: { flex: 1 },

  text: { fontSize: BASE_FONT_SIZE },
  textgroup: {},
  paragraph: { marginBottom: 1 * REM },
  
  hardbreak: { width: '100%', height: 1 },
  softbreak: {},


  toc: {
    borderWidth: 1,
    borderColor: COLOUR_HIGHLIGHT,
    borderRadius: 4,
    paddingVertical: 0.666 * REM,
    paddingHorizontal: 0.5 * REM,
    marginBottom: 1 * REM,
  },
  tocHeader: { fontSize: 1.25 * REM, marginBottom: 0.666 * REM },
  tocList: { marginBottom: 1 * REM },
  nestedTocList: { marginBottom: 0, marginLeft: 1 * REM },
  tocListItem: { flexDirection: 'row', justifyContent: 'flex-start' },
  tocListItemIcon: { fontSize: 1.5 * REM, marginLeft: 1 * REM, marginRight: 0.333 * REM, lineHeight: 1.666 * REM },
  tocListItemText: { fontSize: BASE_FONT_SIZE },
};
