import PropTypes from "prop-types";
import React from "react";

import Button from "../../elements/Button";
import { Container, LeftBubble, RightBubble } from "./index.style";

const Comment = ({ isMe, isPrivate, onRemove, value }) => {
  if (isMe)
    return (
      <Container alignItems="center">
        <Button color="danger" data-testid="button-remove" icon="trash" onClick={onRemove} />
        <RightBubble data-testid="right-bubble" isPrivate={isPrivate}>
          {value}
        </RightBubble>
      </Container>
    );

  return (
    <Container>
      <LeftBubble data-testid="left-bubble" isPrivate={isPrivate}>
        {value}
      </LeftBubble>
    </Container>
  );
};

Comment.propTypes = {
  isMe: PropTypes.bool.isRequired,
  isPrivate: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default Comment;
