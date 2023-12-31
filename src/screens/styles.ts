import { colors, gStyles, theme } from "@theme";
import { Dimensions, Platform, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const screenStyles = StyleSheet.create({
  mainContainer: {
    ...gStyles.mainContainer,
    rowGap: theme.spacing.sm,
    // borderWidth: 1,
  },
  detailsCardHeadingText: {
    ...gStyles.cardInfoTitleText,
    paddingBottom: theme.spacing.md,
    textAlign: "center",
  },
  countRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  countRowItem: {
    flex: 1,
    padding: theme.spacing.sm,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  countRowMiddleItem: {
    borderColor: colors.mediumGray,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  countInfoText: {
    ...gStyles.tblHeaderText,
    marginTop: theme.spacing.md,
  },
  searchContainer: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    columnGap: theme.spacing.sm,
    // justifyContent: "center",
    // paddingLeft: 8,
    // borderWidth: 1,
  },
  searchStyle: {
    display: "flex",
    flex: 1,
    elevation: 0,
  },
  filterButtonStyle: {
    height: 48,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.lg,
    borderColor: colors.borderColor,
    backgroundColor: colors.white,
    // borderWidth: 1,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  formSubmitButtonContainer: {
    columnGap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  flatListStyle: {
    marginTop: theme.spacing.none,
  },
  fieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginVertical: theme.spacing.xs,
    overflow: "hidden",
    // borderWidth: 1,
  },
  singleImgContainer: {
    // borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  imgStyle: {
    ...theme.img.size.lg,
    overflow: "hidden",
    borderRadius: theme.radius.md,
    marginVertical: theme.spacing.xs,
    // borderWidth: 1,
  },
  noImage: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeView: {
    overflow: "hidden",
    borderRadius: theme.radius.xs,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgeText: {
    ...gStyles.tblHeaderText,
    overflow: "hidden",
    textTransform: "capitalize",
    borderRadius: theme.radius.xs,
    color: colors.white,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.xs,
    textAlignVertical: "center",
    backgroundColor: colors.primary,
    textAlign: "center",
  },
  //same text as globals but with left right alignment
  tblHeaderText: {
    ...gStyles.tblHeaderText,
    textAlign: "left",
    flex: 1,
  },
  tblDescText: {
    ...gStyles.tblDescText,
    textAlign: "right",
    flex: 2,
  },
  //external links button style like mailto: or tel:
  linkButton: {
    flexDirection: "row",
    flex: 2,
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  linkText: {
    color: colors.info,
  },
  //take picture from camera or gallery button style
  addedImageBtnStyle: {
    borderWidth: 1,
    borderRadius: theme.radius.xs,
    borderColor: colors.borderColor,
    overflow: "hidden",
  },
  addedImgStyle: {
    ...theme.img.size.md,
    // height: 80,
    // width: 80,
    overflow: "hidden",
  },
  addImageButton: {
    ...theme.img.size.md,
    borderColor: colors.titleText,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.sm,
    borderWidth: 1,
  },
  twoFormInputContainer: {
    flexDirection: "row",
    columnGap: theme.spacing.md,
  },
  filterModalStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxxl,
    margin: theme.spacing.xxl,
    borderRadius: theme.radius.lg,
    // borderWidth: 1,
  },
  radioItemStyle: {
    borderRadius: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    overflow: "hidden",
    borderColor: colors.borderColor,
    borderWidth: 1,
  },
  ratingContainer: {
    alignSelf: "flex-start",
  },
  //date input picker on report screens
  reportDateInputPickerContainer: {
    flexDirection: "row",
  },
});

export const listCardStyles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    borderRadius: theme.radius.sm,
    overflow: "hidden",
    backgroundColor: colors.thinGray,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    // borderWidth: 1,
  },
  //--------------------------------------------------
  reportListRecord: {
    flex: 1,
    //IMP - changes with contentContainer
    flexDirection: "column",
    overflow: "hidden",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    //---------------------------------------
    backgroundColor: colors.white,
    borderRadius: theme.radius.none,
    borderColor: colors.borderColor,
    marginBottom: theme.spacing.xs,
    rowGap: theme.spacing.sm,
    borderBottomWidth: 1,
  },
  reportRecordRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reportRecordRowItemRight: {
    alignItems: "flex-end",
  },
  reportRecordRowItemLeft: {
    alignItems: "flex-start",
  },
  //--------------------------------------------------
  imgContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: theme.radius.full,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    borderColor: colors.titleText,
    width: 64,
    height: 64,
  },
  imgStyle: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.sm,
  },
  infoWithForward: {
    flex: 1,
    flexDirection: "row",
  },
  infoContainer: {
    flex: 9,
    rowGap: 2,
    // borderWidth: 1,
  },

  fieldContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    // flexWrap: "wrap",
    marginBottom: 2,
    overflow: "hidden",
    marginRight: theme.spacing.xs,
    // borderWidth: 1,
  },
  forwardContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    // borderWidth: 1,
  },
  bottomButtonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    // borderWidth: 1,
  },
  bottomButton: { flex: 1 },
});

export const mapStyles = StyleSheet.create({
  markerFixed: {
    left: "50%",
    marginLeft: -16,
    marginTop: 8,
    position: "absolute",
    top: "50%",
  },
  marker: {
    position: "absolute",
    left: SCREEN_WIDTH / 2 - 28,
    height: 56,
    width: 56,
    borderWidth: 0,
    tintColor: colors.secondary,
  },
  defaultControls: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
});
