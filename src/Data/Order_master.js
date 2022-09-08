export const Order_master = [
    {
        Order_id: 1,
        Total_price: 5600,
        Fecha: '5/4/2022',
        Client_name: 'Tony Stark',
        Order_status: 'Paid',
        Tipo_de_Cliente: 'Ventas',
        Metodo_de_Pago: 'Pago con Tarjeta',
        Employee_id: 1          // Foreign Key
    },
    {
        Order_id: 2,
        Total_price: 8200,
        Fecha: '6/4/2022',
        Client_name: 'Black Widow',
        Order_status: 'Unpaid',
        Tipo_de_Cliente: 'Ventas',
        Metodo_de_Pago: 'Pago con Efectivo',
        Employee_id: 1          // Foreign Key
    },
    {
        Order_id: 3,
        Total_price: 19000,
        Fecha: '6/4/2022',
        Client_name: 'Captain America',
        Order_status: 'Paid',
        Tipo_de_Cliente: 'Compra por menor',
        Metodo_de_Pago: 'Pago con Tarjeta',
        Employee_id: 2          // Foreign Key
    },
    {
        Order_id: 4,
        Total_price: 2600,
        Fecha: '7/4/2022',
        Client_name: 'Doctor Strange',
        Order_status: 'Paid',
        Tipo_de_Cliente: 'Ventas',
        Metodo_de_Pago: 'Pago con Tarjeta',
        Employee_id: 3          // Foreign Key
    },
    {
        Order_id: 5,
        Total_price: 5200,
        Fecha: '8/4/2022',
        Client_name: 'Thor',
        Order_status: 'Paid',
        Tipo_de_Cliente: 'Ventas',
        Metodo_de_Pago: 'Pago con Tarjeta',
        Employee_id: 3          // Foreign Key
    }
]