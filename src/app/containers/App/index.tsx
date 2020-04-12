import React from 'react';
import { RouteComponentProps } from 'react-router';

export namespace App {
  export interface Props extends RouteComponentProps<void> {}
}

export const App = ({ history, location }: App.Props) => {

  return (
    <div>
      <img src="/assets/images/original.jpg" />
    </div>
  );
};
