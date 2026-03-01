import { Routes, Route} from 'react-router-dom';
import Header from './layouts/header';
import Footer from './layouts/footer';
import Login from './pages/loginView';
import Home from './pages/homeView';
import Register from './pages/registerView';

function App() {

    return (
        <div >
            <Header />
            <div id="body-main">
                <Routes>
                    <Route path='/home' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                </Routes>
            </div>
            <Footer />
        </div>
    )
}

export default App
