import { Link } from "@remix-run/react";

interface IProps {
  datetime: string;
}

export default function TimeFormatted({ datetime }: IProps) {
    const date = new Date(datetime)

    return (
        <span>{date.getHours() +':'+ date.getMinutes()}</span>
    );
}