"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[arduino-uploader]').forEach((el) => {
        el.addEventListener('click', async () => {
            if (!navigator.serial)
                return alert('Please enable the Web Serial API first: https://web.dev/serial/#use');
            const hexHref = el.getAttribute('hex-href');
            const board = el.getAttribute('board');
            const verify = el.hasAttribute('verify');
            const progressEl = el.querySelector('.upload-progress');
            const onProgress = (progress) => {
                progressEl.innerHTML = `${progress}%`;
            };
            let portFilters = {};
            try {
                portFilters = { filters: JSON.parse(el.getAttribute('port-filters')) || [] };
            }
            catch (e) { }
            try {
                await _1.upload(_1.boards[board], hexHref, onProgress, verify, portFilters);
            }
            catch (e) {
                progressEl.innerHTML = 'Error!';
                alert(e);
                throw e;
            }
            progressEl.innerHTML = 'Done!';
            console.log("Upload successful!\nEnvious? here's how https://github.com/dbuezas/arduino-web-uploader");
        });
    });
});
//# sourceMappingURL=test.js.map