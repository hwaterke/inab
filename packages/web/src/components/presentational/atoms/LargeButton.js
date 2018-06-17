import styled from 'styled-components'

export const LargeButton = styled.button.attrs({className: 'btn'})`
  margin-top: 1rem;
  display: block;
  width: 100%;
  color: white;
  border-color: #85c9e6;
  background-color: #85c9e6;

  &:hover {
    border-color: #85c9e6 - #111;
    background-color: #85c9e6 - #111;
  }
`
