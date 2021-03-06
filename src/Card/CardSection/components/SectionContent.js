// @flow
import * as React from "react";
import styled, { css } from "styled-components";

import transition from "../../../utils/transition";
import defaultTheme from "../../../defaultTheme";
import Slide from "../../../utils/Slide";
import mq from "../../../utils/mediaQuery";

const StyledCardSectionContent = styled.div`
  font-family: ${({ theme }) => theme.orbit.fontFamily};
  font-size: ${({ theme }) => theme.orbit.fontSizeTextNormal};
  line-height: ${({ theme }) => theme.orbit.lineHeightTextNormal};
  color: ${({ theme }) => theme.orbit.colorTextPrimary};
  width: 100%;
  border-top: ${({ theme, expanded, noSeparator }) =>
    expanded && !noSeparator
      ? `1px solid ${theme.orbit.paletteCloudNormal}`
      : `0px solid ${theme.orbit.paletteCloudNormal}`};
  padding-top: ${({ hasPaddingTop, theme }) => hasPaddingTop && theme.orbit.spaceMedium};
  transition: ${transition(["padding", "border-top"], "fast", "linear")};

  ${mq.largeMobile(css`
    padding-top: ${({ theme, hasPaddingTop }) => hasPaddingTop && theme.orbit.spaceLarge};
  `)}
`;

StyledCardSectionContent.defaultProps = {
  theme: defaultTheme,
};

type Props = {|
  expandable: boolean,
  expanded?: boolean,
  children?: React.Node,
  noSeparator?: boolean,
  hasPaddingTop: boolean,
  slideID: string,
  labelID: string,
|};

const SectionContent = ({
  expandable,
  expanded,
  children,
  noSeparator,
  hasPaddingTop,
  slideID,
  labelID,
}: Props) => {
  const ref: { current: any | HTMLElement } = React.useRef(null);
  const [contentHeight, setContentHeight] = React.useState(expanded ? null : 0);

  React.useEffect(() => {
    const calculateHeight = () => {
      if (ref && ref.current) {
        const { height } = ref.current.getBoundingClientRect();
        setContentHeight(height);
      }
    };

    calculateHeight();

    window.addEventListener("resize", calculateHeight);
    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  return (
    <>
      {expandable ? (
        <Slide maxHeight={contentHeight} expanded={expanded} id={slideID} ariaLabelledBy={labelID}>
          <StyledCardSectionContent
            noSeparator={noSeparator}
            ref={ref}
            expanded={expanded}
            hasPaddingTop={hasPaddingTop}
            expandable={expandable}
          >
            {children}
          </StyledCardSectionContent>
        </Slide>
      ) : (
        <StyledCardSectionContent ref={ref} hasPaddingTop={hasPaddingTop}>
          {children}
        </StyledCardSectionContent>
      )}
    </>
  );
};

export default SectionContent;
