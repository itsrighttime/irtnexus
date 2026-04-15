export const handleOnClick = (value: string) => {
  console.log(value);
};

export const tabsHandler = {
  // Level1 - Top
  leftTopLevel10: { onClick: handleOnClick },
  leftTopLevel11: { onClick: handleOnClick },
  leftTopLevel12: { onClick: handleOnClick },
  midTopLevel10: { onClick: handleOnClick },
  midTopLevel11: { onClick: handleOnClick },
  midTopLevel12: { onClick: handleOnClick },
  rightTopLevel10: { onClick: handleOnClick },
  rightTopLevel11: { onClick: handleOnClick },
  rightTopLevel12: { onClick: handleOnClick },

  // Level1 - Bottom
  leftBottomLevel10: { onClick: handleOnClick },
  leftBottomLevel11: { onClick: handleOnClick },
  leftBottomLevel12: { onClick: handleOnClick },
  midBottomLevel10: { onClick: handleOnClick },
  midBottomLevel11: { onClick: handleOnClick },
  midBottomLevel12: { onClick: handleOnClick },
  rightBottomLevel10: { onClick: handleOnClick },
  rightBottomLevel11: { onClick: handleOnClick },
  rightBottomLevel12: { onClick: handleOnClick },

  // Level1 - Left
  leftLeftLevel10: { onClick: handleOnClick },
  leftLeftLevel11: { onClick: handleOnClick },
  leftLeftLevel12: { onClick: handleOnClick },
  midLeftLevel10: { onClick: handleOnClick },
  midLeftLevel11: { onClick: handleOnClick },
  midLeftLevel12: { onClick: handleOnClick },
  rightLeftLevel10: { onClick: handleOnClick },
  rightLeftLevel11: { onClick: handleOnClick },
  rightLeftLevel12: { onClick: handleOnClick },

  // Level1 - Right
  leftRightLevel10: { onClick: handleOnClick },
  leftRightLevel11: { onClick: handleOnClick },
  leftRightLevel12: { onClick: handleOnClick },
  midRightLevel10: { onClick: handleOnClick },
  midRightLevel11: { onClick: handleOnClick },
  midRightLevel12: { onClick: handleOnClick },
  rightRightLevel10: { onClick: handleOnClick },
  rightRightLevel11: { onClick: handleOnClick },
  rightRightLevel12: { onClick: handleOnClick },

  // Level2 - Top
  leftTopLevel20: { onClick: handleOnClick },
  leftTopLevel21: { onClick: handleOnClick },
  leftTopLevel22: { onClick: handleOnClick },
  midTopLevel20: { onClick: handleOnClick },
  midTopLevel21: { onClick: handleOnClick },
  midTopLevel22: { onClick: handleOnClick },
  rightTopLevel20: { onClick: handleOnClick },
  rightTopLevel21: { onClick: handleOnClick },
  rightTopLevel22: { onClick: handleOnClick },

  // Level2 - Bottom
  leftBottomLevel20: { onClick: handleOnClick },
  leftBottomLevel21: { onClick: handleOnClick },
  leftBottomLevel22: { onClick: handleOnClick },
  midBottomLevel20: { onClick: handleOnClick },
  midBottomLevel21: { onClick: handleOnClick },
  midBottomLevel22: { onClick: handleOnClick },
  rightBottomLevel20: { onClick: handleOnClick },
  rightBottomLevel21: { onClick: handleOnClick },
  rightBottomLevel22: { onClick: handleOnClick },

  // Level2 - Left
  leftLeftLevel20: { onClick: handleOnClick },
  leftLeftLevel21: { onClick: handleOnClick },
  leftLeftLevel22: { onClick: handleOnClick },
  midLeftLevel20: { onClick: handleOnClick },
  midLeftLevel21: { onClick: handleOnClick },
  midLeftLevel22: { onClick: handleOnClick },
  rightLeftLevel20: { onClick: handleOnClick },
  rightLeftLevel21: { onClick: handleOnClick },
  rightLeftLevel22: { onClick: handleOnClick },

  // Level2 - Right
  leftRightLevel20: { onClick: handleOnClick },
  leftRightLevel21: { onClick: handleOnClick },
  leftRightLevel22: { onClick: handleOnClick },
  midRightLevel20: { onClick: handleOnClick },
  midRightLevel21: { onClick: handleOnClick },
  midRightLevel22: { onClick: handleOnClick },
  rightRightLevel20: { onClick: handleOnClick },
  rightRightLevel21: { onClick: handleOnClick },
  rightRightLevel22: { onClick: handleOnClick },
};

export type TabKey = keyof typeof tabsHandler;
type TabHandler = {
  onClick: (value: string) => void;
};

export const getTabDetails = (key: TabKey): TabHandler => {
  return tabsHandler[key];
};
