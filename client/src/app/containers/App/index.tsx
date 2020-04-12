import React from 'react';
import style from './style.css';
import { RouteComponentProps } from 'react-router';

export namespace App {
  export interface Props extends RouteComponentProps<void> {}
  export interface Params {
    level: string
  }
}

export const App = ({ match }: App.Props) => {
  const {level = 10} = match.params as any

  console.log(match.params)
  console.log(level)

  const getImageTiles = () => {
    const numTileX = 20;
    const numTileY = 20;

    const result: any[] = new Array<any>()

    for (let i = 0; i < numTileY; i++) {
      for (let j = 0; j < numTileX; j++) {
        let isImageFound = true;
        try {
          require(`../../../assets/images/${level}/${j}_${i}.jpg`);
        } catch (e) {
          isImageFound = false;
        }

        console.log('isImageFound', isImageFound)
        if (isImageFound) {
          result.push(<img src={`assets/images/${level}/${j}_${i}.jpg`} />)
        }
      }
      result.push(<br/>)
    }
    return result;
  }

  return (
    <div className={style.container}>
      {
        getImageTiles()
      }
    </div>
  );
};
