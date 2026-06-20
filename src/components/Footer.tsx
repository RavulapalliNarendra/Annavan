export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-green-400 mb-4">ANNAVAN</h3>
                        <p className="text-gray-400 text-sm">
                            Direct Farmer to Market. Empowering agriculture through technology.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/about" className="hover:text-white transition">About Us</a></li>
                            <li><a href="/login" className="hover:text-white transition">Login / Register</a></li>
                            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Customer Support</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><span className="block text-gray-500 text-xs uppercase">Support Lead</span> Narendra</li>
                            <li><span className="block text-gray-500 text-xs uppercase">Mobile</span> +91 93925 59023</li>
                            <li><span className="block text-gray-500 text-xs uppercase">Email</span> narendra.yadav.ravulapalli@gmail.com</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Annavan. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
