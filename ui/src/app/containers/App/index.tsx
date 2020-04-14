import React, {useState} from 'react';
import style from './style.css';
import { RouteComponentProps } from 'react-router';

export namespace App {
  export interface Props extends RouteComponentProps<void> {}
}

export const App = ({ match }: App.Props) => {
  const [level, setLevel] = useState(5);

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

  const onChange = (event: any) => {
    let value = event.target.value;
    if (value < 0) {
      value = 0;
    }

    if (value > 12) {
      value = 12
    }
    setLevel(value)
  }

  return (
    <div>
      level &nbsp; &nbsp;
      <input
        type="number"
        name="level"
        value={level}
        onChange={onChange}
      />

      <div className={style.container}>
        {
          getImageTiles()
        }
      </div>
    </div>
  );
};
