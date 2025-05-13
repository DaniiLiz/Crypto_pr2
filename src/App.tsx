import { BrowserRouter as Router } from "react-router-dom";
import styles from "./App.module.css";
import Table from "./pages/Table";
import Navbar from "./components/Navbar";

function App() {
    return (
        <Router>
            <div className={styles.grid}>
                <Navbar />
                <Table />
            </div>
        </Router>
    );
}

export default App;