const fs = require("fs");
const readline = require("readline");

const dbFile = "db.json";

// Fungsi membaca database
function loadDatabase() {
    if (!fs.existsSync(dbFile)) return [];
    return JSON.parse(fs.readFileSync(dbFile, "utf-8"));
}

// Fungsi menyimpan database
function saveDatabase(data) {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// Menampilkan semua film
function showAllMovies() {
    const movies = loadDatabase();
    console.log("\n📜 Daftar Film:");
    movies.forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title} (${movie.year}) - Genre: ${movie.genre}`);
    });
}

// Menambahkan film baru
function addMovie(rl) {
    rl.question("Masukkan judul film: ", (title) => {
        rl.question("Masukkan tahun rilis: ", (year) => {
            rl.question("Masukkan genre: ", (genre) => {
                const movies = loadDatabase();
                const newMovie = { id: Date.now(), title, year, genre };
                movies.push(newMovie);
                saveDatabase(movies);
                console.log(`✅ Film "${title}" berhasil ditambahkan!`);
                showMenu(rl);
            });
        });
    });
}

// Melihat satu film berdasarkan ID
function viewMovie(rl) {
    rl.question("Masukkan ID film: ", (id) => {
        const movies = loadDatabase();
        const movie = movies.find(m => m.id == id);
        if (movie) {
            console.log(`🎬 ${movie.title} (${movie.year}) - Genre: ${movie.genre}`);
        } else {
            console.log("⚠️ Film tidak ditemukan!");
        }
        showMenu(rl);
    });
}

// Mengupdate film berdasarkan ID
function updateMovie(rl) {
    rl.question("Masukkan ID film yang ingin diupdate: ", (id) => {
        const movies = loadDatabase();
        const index = movies.findIndex(m => m.id == id);
        if (index === -1) {
            console.log("⚠️ Film tidak ditemukan!");
            return showMenu(rl);
        }

        rl.question("Masukkan judul baru: ", (title) => {
            rl.question("Masukkan tahun baru: ", (year) => {
                rl.question("Masukkan genre baru: ", (genre) => {
                    movies[index] = { id: movies[index].id, title, year, genre };
                    saveDatabase(movies);
                    console.log(`✅ Film "${title}" berhasil diperbarui!`);
                    showMenu(rl);
                });
            });
        });
    });
}

// Menghapus film berdasarkan ID
function deleteMovie(rl) {
    rl.question("Masukkan ID film yang ingin dihapus: ", (id) => {
        let movies = loadDatabase();
        const filteredMovies = movies.filter(m => m.id != id);
        if (movies.length === filteredMovies.length) {
            console.log("⚠️ Film tidak ditemukan!");
        } else {
            saveDatabase(filteredMovies);
            console.log("🗑️ Film berhasil dihapus!");
        }
        showMenu(rl);
    });
}

// Menampilkan menu utama
function showMenu(rl) {
    console.log("\n🎬 Menu Film Database:");
    console.log("1. Lihat daftar film");
    console.log("2. Tambah film");
    console.log("3. Lihat satu film");
    console.log("4. Update film");
    console.log("5. Hapus film");
    console.log("6. Keluar");

    rl.question("Masukkan nomor pilihan: ", (choice) => {
        switch (choice) {
            case "1":
                showAllMovies();
                showMenu(rl);
                break;
            case "2":
                addMovie(rl);
                break;
            case "3":
                viewMovie(rl);
                break;
            case "4":
                updateMovie(rl);
                break;
            case "5":
                deleteMovie(rl);
                break;
            case "6":
                console.log("👋 Sampai jumpa!");
                rl.close();
                break;
            default:
                console.log("❌ Pilihan tidak valid!");
                showMenu(rl);
        }
    });
}

// Inisialisasi CLI
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("🎥 Selamat datang di Movie Database!");
showMenu(rl);
