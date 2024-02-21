import Header from '../../components/Header'

export default function MessengerLayout({ children }) {
    return (
        <>
            <Header></Header>
            {children}
        </>
    );
}
