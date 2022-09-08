import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const navigation_data = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <FontAwesomeIcon icon="gauge-simple" size='lg'/>,
        cName: 'sidebar_link'
    },
    {
        title: 'Productos',
        path: '/productos',
        icon: <FontAwesomeIcon icon="cart-shopping" size='lg'/>,
        cName: 'sidebar_link'
    },
    {
        title: 'Ordenes',
        path: '/ordenes',
        icon: <FontAwesomeIcon icon="clipboard-list" size='xl'/>,
        cName: 'sidebar_link'
    },
    {
        title: 'Expenses',
        path: '/expenses',
        icon: <FontAwesomeIcon icon="flask" size='lg'/>,
        cName: 'sidebar_link'
    }
]