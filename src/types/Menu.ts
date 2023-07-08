export type Menu = {
    name: string;
    link: string;
    order: number;
    children: {
        name: string;
        link: string;
        order: number;
    }[]
}
