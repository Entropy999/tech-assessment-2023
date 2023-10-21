import * as React from 'react';
import EmployeeTable from './components/EmployeeTable';


export default function App() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',  // Vertically center the content
      justifyContent: 'center',  // Horizontally center the content
      alignSelf: 'center',
      flexDirection: 'column', // Stack items vertically
      textAlign: 'center',    // Center-align text
    }}>
      <h1>Employees</h1>
      <div style={{
        width: '800px',  // Set the desired width for the table
        height: '500px', // Set the desired height for the table
      }}>
        <EmployeeTable />
      </div>
    </div>
  );
}
