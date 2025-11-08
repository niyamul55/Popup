function handleAction(type) {
  const apkFile = document.getElementById('apkFile').files[0];
  const zipFile = document.getElementById('zipFile').files[0];
  const status = document.getElementById('status');
  status.innerHTML = '⏳ Processing...';

  if (!apkFile) {
    alert('Please select an APK file first.');
    status.innerHTML = '';
    return;
  }

  const zip = new JSZip();

  const promises = [apkFile.arrayBuffer().then(data => zip.file(apkFile.name, data))];

  if (zipFile && type === 'add') {
    promises.push(zipFile.arrayBuffer().then(data => zip.file(zipFile.name, data)));
  }

  Promise.all(promises).then(() => {
    zip.generateAsync({type:'blob'}).then(content => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = type === 'add' ? 'patched_bundle.zip' : 'cleaned_apk.zip';
      a.click();
      status.innerHTML = '✅ Done! File ready for download.';
    });
  });
}

document.getElementById('removeBtn').onclick = () => handleAction('remove');
document.getElementById('addBtn').onclick = () => handleAction('add');

// Load JSZip dynamically
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
document.head.appendChild(script);
