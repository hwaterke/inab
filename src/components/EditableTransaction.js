import React from 'react';
import DatePicker from 'react-datepicker';
require('react-datepicker/dist/react-datepicker.css');
import moment from 'moment';

export default class EditableTransaction extends React.Component {
  render() {
    return (
      <tr>
        <td></td>
        <td>
          <DatePicker selected={moment()} onChange={()=>{}} />
        </td>
        <td><input type="text" name="name" placeholder="Mouhaha" /></td>
        <td><input type="text" name="name" value="" placeholder="Mouhaha" /></td>
        <td><input type="text" name="name" value="" /></td>
        <td><input type="text" name="name" value="" /></td>
      </tr>
    );
  }
}
