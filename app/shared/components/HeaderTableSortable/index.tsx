import { Link } from "@remix-run/react";

interface IProps {
  name: string;
  orderBy: string;
  orderDirection: string;
  currOrder: string;
}

export default function HeaderTableSortable({ name, orderBy, orderDirection, currOrder }: IProps) {
    return (
        <th>
            <Link to={'/?orderBy='+orderBy+'&orderDirection=' + (!orderDirection || currOrder != orderBy ? 'asc' : 'desc')}>{name}</Link>
        </th>
    );
}