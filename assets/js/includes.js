export async function includeFragments(root = document){
  const nodes = root.querySelectorAll('[data-include]');
  await Promise.all(Array.from(nodes).map(async (node) => {
    const path = node.getAttribute('data-include');
    if (!path) return;
    const res = await fetch(`/${path}`);
    if (!res.ok) throw new Error(`Failed to load fragment: ${path}`);
    node.innerHTML = await res.text();
    node.removeAttribute('data-include');
  }));
}
