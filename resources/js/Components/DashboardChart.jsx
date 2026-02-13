import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardChart({ chartData }) {
    const data = {
        labels: chartData.labels, // ex : ['Jan', 'Feb', 'Mar']
        datasets: [
            {
                label: 'Réservations',
                data: chartData.reservations, // ex : [5, 10, 7]
                backgroundColor: 'rgba(99, 102, 241, 0.7)', // Indigo
            },
            {
                label: 'Revenus',
                data: chartData.revenue, // ex : [1200, 1500, 900]
                backgroundColor: 'rgba(34, 197, 94, 0.7)', // Vert
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Statistiques Mensuelles' },
        },
    };

    return <Bar data={data} options={options} />;
}
