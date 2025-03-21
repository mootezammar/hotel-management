const generateGuestId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3 chiffres aléatoires

    return `guest-${year}${month}${day}${random}`;
};

module.exports = { generateGuestId };