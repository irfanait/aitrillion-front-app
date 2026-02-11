import React, { useRef, useState, useEffect } from "react";
import { Tooltip } from "antd";
import { EllipsisWrapper } from "./style";

const OverflowTooltip = ({ children, ...rest }) => {
  const textRef = useRef(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsOverflowed(el.scrollWidth > el.clientWidth);
    }
  }, [children]);

  const content = (
    <EllipsisWrapper
      ref={textRef}
      title={typeof children === "string" ? undefined : ""}
    >
      {children}
    </EllipsisWrapper>
  );

  return isOverflowed ? <Tooltip title={children}>{content}</Tooltip> : content;
};

export default OverflowTooltip;
