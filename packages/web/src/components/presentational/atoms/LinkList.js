import styled from 'styled-components'

export const LinkList = styled.div`
  margin: 1rem 0;

  > a {
    &:first-child {
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
    }

    &:last-child {
      border-bottom-right-radius: 6px;
      border-bottom-left-radius: 6px;
    }

    display: block;
    padding: 0.75rem 1.25rem;
    border-top: 1px solid hsla(0, 0%, 4%, 0.1);
    border-right: 1px solid hsla(0, 0%, 4%, 0.1);
    border-left: 1px solid hsla(0, 0%, 4%, 0.1);

    &:last-child {
      border-bottom: 1px solid hsla(0, 0%, 4%, 0.1);
    }
  }
`
