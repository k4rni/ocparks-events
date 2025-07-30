import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import EventList from "../islands/EventList.tsx";

export default function Home() {
  return (
    <div class="container">
      <Navbar />
      <main class="content">
        <h1>Discover and Explore OC Parks Events with Smart Filtering</h1>
        <EventList />
      </main>
      <Footer />
    </div>
  );
}
