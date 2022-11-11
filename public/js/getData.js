async function getData() {
    const op = await fetch('/api/user/getTransaction').then(res => res.json());
    return op;
}