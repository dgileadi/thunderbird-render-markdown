function saveScope(e) {
  let scope = Array.from(document.getElementsByName('scope')).find(
    (option) => option.checked
  ).value;

  browser.storage.sync.set({
    scope: scope,
  });
  e.preventDefault();
}

function restoreOptions() {
  browser.storage.sync.get('scope').then((res) => {
    let scope = res.scope || 'all-plain-text';
    document.getElementById(scope).checked = true;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
Array.from(document.getElementsByName('scope')).forEach((option) =>
  option.addEventListener('change', saveScope)
);
