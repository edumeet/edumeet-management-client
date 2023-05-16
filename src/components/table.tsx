import React, { useMemo } from 'react';
// eslint-disable-next-line camelcase
import MaterialReactTable, { type MRT_ColumnDef } from 'material-react-table';

type Person = {
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  city: string;
  state: string;
};

// nested data is ok, see accessorKeys in ColumnDef below
const data: Person[] = [
	{
		name: {
			firstName: 'Teszt',
			lastName: 'Elek',
		},
		address: '000 Test',
		city: 'Test',
		state: 'Test',
	},
	{
		name: {
			firstName: 'Teszt2',
			lastName: 'Elek2',
		},
		address: '000 Test',
		city: 'Test',
		state: 'Test',
	},
  
];

const Table = () => {
	// should be memoized or stable
	// eslint-disable-next-line camelcase
	const columns = useMemo<MRT_ColumnDef<Person>[]>(
		() => [
			{
				accessorKey: 'name.firstName', // access nested data with dot notation
				header: 'Test',
			},
			{
				accessorKey: 'name.lastName',
				header: 'Test',
			},
			{
				accessorKey: 'address', // normal accessorKey
				header: 'Test',
			},
			{
				accessorKey: 'city',
				header: 'Test',
			},
			{
				accessorKey: 'state',
				header: 'Test',
			},
		],
		[],
	);

	return <MaterialReactTable columns={columns} data={data} />;
};

export default Table;
