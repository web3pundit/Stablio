import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Bookmark from './pages/MyBookmarks';
import Header from './assets/components/Header';
import Layout from './assets/components/Layout';
import Resources from './pages/Resources';
import Stablecoins from './pages/Stablecoins';
import Submit from './pages/Submit';
import Experts from './pages/Experts';
import AdminPanel from './pages/AdminPanel'; 
import StablecoinDetail from './pages/StablecoinDetail';
import RegulatoryClarity from './pages/RegulatoryClarity'; 
import Jobs from './pages/Jobs';
import Events from './pages/Events';
import Footer from './pages/footer';


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full flex flex-col bg-gray-50">
        <Toaster position="top-center" reverseOrder={false} />
        <Header />

        {/* Main Content */}
        <main className="flex-1 w-full bg-gray-50">
          <div className="max-w-7xl w-full mx-auto px-4 py-6">
            <Routes>
              <Route
                path="/"
                element={
                  <Layout>
                    <Resources />
                  </Layout>
                }
              />
              <Route
                path="/auth"
                element={
                  <Layout>
                    <Auth />
                  </Layout>
                }
              />
              <Route
                path="/bookmarks"
                element={
                  <Layout>
                    <Bookmark />
                  </Layout>
                }
              />
              <Route
                path="/home"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />
              <Route
                path="/resources"
                element={
                  <Layout>
                    <Resources />
                  </Layout>
                }
              />
              <Route
                path="/stablecoins"
                element={
                  <Layout>
                    <Stablecoins />
                  </Layout>
                }
              />
              <Route
                path="/experts"
                element={
                  <Layout>
                    <Experts />
                  </Layout>
                }
              />
              <Route
                path="/submit"
                element={
                  <Layout>
                    <Submit />
                  </Layout>
                }
              />
              <Route
                path="/admin"
                element={
                  <Layout>
                    <AdminPanel />
                  </Layout>
                }
              />
              <Route
                path="/stablecoins/:id"
                element={
                  <Layout>
                    <StablecoinDetail />
                  </Layout>
                }
              />
              <Route
                path="/regulatory"
                element={
                  <Layout>
                    <RegulatoryClarity />
                  </Layout>
                }
              />
              <Route
              path="/jobs"
              element={
              <Layout>
                <Jobs />
                </Layout>
              }
              />
              <Route
              path="/events"
              element={
              <Layout>
                <Events />
                </Layout>
              }
              />

              <Route
                path="*"
                element={
                  <Layout>
                    <h1 className="text-3xl font-bold text-center text-gray-800">
                      Page Not Found
                    </h1>
                  </Layout>
                }
              />
              <Route
              path="/footer"
              element={
              <Layout>
                <Footer />
                </Layout>
              }
              />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
