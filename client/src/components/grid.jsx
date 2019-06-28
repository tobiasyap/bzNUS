import React from 'react';
import { Table } from 'reactstrap';
import { Row } from 'reactstrap';
import data from '../data'

export default class Grid extends React.Component {
  constructor(props){
      super(props);
      this.Data = data;
  }

  render() {
    return (
      <Table bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">0800-<Row></Row>0900</th>
            <td><li>Lisa</li><li>Mark</li></td>
            <td>Otto</td>
            <td>{ this.Data["GEH1063"][0]["startTime"] }</td>
            <td>Ben</td>
            <td>@mdos</td>
          </tr>
          <tr>
            <th scope="row">0900-<Row></Row>1000</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">1000-<Row></Row>1100</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">1100-<Row></Row>1200</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">1200-<Row></Row>1300</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">1300-<Row></Row>1400</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">1400-<Row></Row>1500</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">1500-<Row></Row>1600</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">1600-<Row></Row>1700</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">1700-<Row></Row>1800</th>
            <td>Mark></td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
        </tbody>
      </Table>
    );
  }
}