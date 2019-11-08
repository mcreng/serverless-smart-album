import React from 'react'
import styled from 'styled-components'

const Relative = styled('div')`
  position: relative;
  width:0px;
`

const StyledSquare = styled('div')`
  border: ${props => props.border || '5px solid red'};
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  position: absolute;
  color: red;
`

const ClassBox = ({ area }) => {
  const { x1, x2, y1, y2 } = area
  const left = Math.min(x1, x2)
  const maxx = Math.max(x1, x2)
  const top = Math.min(y1, y2)
  const maxy = Math.max(y1, y2)
  const name = area.class
  return (
    <StyledSquare left={left} top={top} width={maxx - left} height={maxy - top}>
      {name}
    </StyledSquare>
  )
}

export default ({ src, areas }) => {
  return (
    <Relative>
      <img src={src}/>
      {areas.map((area) => <ClassBox area={area}/>)}
    </Relative>
  )
}
