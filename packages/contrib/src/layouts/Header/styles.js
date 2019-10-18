import css from "styled-jsx/css";

export default css`
  .Container {
    align-items: center;
    background-color: white;
    border-top: solid 0.3rem black;
    box-shadow: 0 0 0.125rem lightgray;
    display: flex;
    justify-content: space-between;
    min-height: 6rem;
    padding: 1rem;
    position: relative;
    user-select: none;
    z-index: 1;
  }

  .Brand {
    align-items: center;
    cursor: pointer;
    display: flex;
    height: 3rem;
  }

  .BrandText {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
  }

  .BrandTextTitle {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.2;
  }

  .BrandTextSubtitle {
    color: var(--color-mummy-tomb);
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5;
  }

  .User {
    align-items: center;
    display: flex;
  }
`;
