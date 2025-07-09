document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const schedulingType = document.getElementById('schedulingType');
    const cpuScheduling = document.getElementById('cpuScheduling');
    const diskScheduling = document.getElementById('diskScheduling');
    const memoryScheduling = document.getElementById('memoryScheduling');
    const processCount = document.getElementById('processCount');
    const processInputs = document.getElementById('processInputs');
    const requestInputs = document.getElementById('requestInputs');
    const blockInputs = document.getElementById('blockInputs');
    const processSizeInputs = document.getElementById('processSizeInputs');
    const calculateBtn = document.getElementById('calculateBtn');
    const results = document.getElementById('results');
    const ganttChart = document.getElementById('ganttChart');
    const statistics = document.getElementById('statistics');

    // Event Listeners
    schedulingType.addEventListener('change', handleSchedulingTypeChange);
    processCount.addEventListener('change', handleProcessCountChange);
    document.getElementById('requestCount').addEventListener('change', handleRequestCountChange);
    document.getElementById('blockCount').addEventListener('change', handleBlockCountChange);
    document.getElementById('processCountMem').addEventListener('change', handleProcessSizeCountChange);
    calculateBtn.addEventListener('click', handleCalculate);

    // Handle scheduling type change
    function handleSchedulingTypeChange() {
        cpuScheduling.classList.add('hidden');
        diskScheduling.classList.add('hidden');
        memoryScheduling.classList.add('hidden');
        results.classList.add('hidden');

        switch (schedulingType.value) {
            case 'cpu':
                cpuScheduling.classList.remove('hidden');
                break;
            case 'disk':
                diskScheduling.classList.remove('hidden');
                break;
            case 'memory':
                memoryScheduling.classList.remove('hidden');
                break;
        }
    }

    // Handle process count change
    function handleProcessCountChange() {
        const count = parseInt(processCount.value);
        processInputs.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const processDiv = document.createElement('div');
            processDiv.className = 'process-input';
            processDiv.innerHTML = `
                <div>
                    <label>Process ${i + 1} Arrival Time:</label>
                    <input type="number" min="0" class="arrival-time" value="0">
                </div>
                <div>
                    <label>Process ${i + 1} Burst Time:</label>
                    <input type="number" min="1" class="burst-time" value="1">
                </div>
                <div>
                    <label>Process ${i + 1} Priority:</label>
                    <input type="number" min="0" class="priority" value="0">
                </div>
            `;
            processInputs.appendChild(processDiv);
        }
    }

    // Handle request count change
    function handleRequestCountChange() {
        const count = parseInt(document.getElementById('requestCount').value);
        requestInputs.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const requestDiv = document.createElement('div');
            requestDiv.className = 'request-input';
            requestDiv.innerHTML = `
                <div>
                    <label>Request ${i + 1} Position:</label>
                    <input type="number" min="0" class="request-position" value="0">
                </div>
            `;
            requestInputs.appendChild(requestDiv);
        }
    }

    // Handle block count change
    function handleBlockCountChange() {
        const count = parseInt(document.getElementById('blockCount').value);
        blockInputs.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const blockDiv = document.createElement('div');
            blockDiv.className = 'block-input';
            blockDiv.innerHTML = `
                <div>
                    <label>Block ${i + 1} Size:</label>
                    <input type="number" min="1" class="block-size" value="100">
                </div>
            `;
            blockInputs.appendChild(blockDiv);
        }
    }

    // Handle process size count change
    function handleProcessSizeCountChange() {
        const count = parseInt(document.getElementById('processCountMem').value);
        processSizeInputs.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const processDiv = document.createElement('div');
            processDiv.className = 'process-size-input';
            processDiv.innerHTML = `
                <div>
                    <label>Process ${i + 1} Size:</label>
                    <input type="number" min="1" class="process-size" value="50">
                </div>
            `;
            processSizeInputs.appendChild(processDiv);
        }
    }

    // Handle calculate button click
    function handleCalculate() {
        switch (schedulingType.value) {
            case 'cpu':
                const processes = getProcessData();
                const algorithm = document.getElementById('cpuAlgorithm').value;
                const quantum = algorithm === 'rr' ? parseInt(document.getElementById('timeQuantum').value) : null;
                const result = calculateScheduling(processes, algorithm, quantum);
                displayResults(result);
                break;
            case 'disk':
                const requests = getDiskRequests();
                const diskAlgorithm = document.getElementById('diskAlgorithm').value;
                const head = parseInt(document.getElementById('headPosition').value);
                const diskResult = calculateDiskScheduling(requests, diskAlgorithm, head);
                displayDiskResults(diskResult);
                break;
            case 'memory':
                const blocks = getMemoryBlocks();
                const processSizes = getProcessSizes();
                const memoryAlgorithm = document.getElementById('memoryAlgorithm').value;
                const memoryResult = calculateMemoryAllocation(blocks, processSizes, memoryAlgorithm);
                displayMemoryResults(memoryResult);
                break;
        }
    }

    // Get process data from inputs
    function getProcessData() {
        const processDivs = processInputs.getElementsByClassName('process-input');
        const processes = [];

        for (let i = 0; i < processDivs.length; i++) {
            const div = processDivs[i];
            processes.push({
                id: i + 1,
                arrivalTime: parseInt(div.querySelector('.arrival-time').value) || 0,
                burstTime: parseInt(div.querySelector('.burst-time').value) || 1,
                priority: parseInt(div.querySelector('.priority').value) || 0,
                remainingTime: parseInt(div.querySelector('.burst-time').value) || 1
            });
        }

        return processes;
    }

    // Get disk requests
    function getDiskRequests() {
        const requestDivs = requestInputs.getElementsByClassName('request-input');
        const requests = [];

        for (let i = 0; i < requestDivs.length; i++) {
            const div = requestDivs[i];
            requests.push(parseInt(div.querySelector('.request-position').value) || 0);
        }

        return requests;
    }

    // Get memory blocks
    function getMemoryBlocks() {
        const blockDivs = blockInputs.getElementsByClassName('block-input');
        const blocks = [];

        for (let i = 0; i < blockDivs.length; i++) {
            const div = blockDivs[i];
            blocks.push({
                id: i + 1,
                size: parseInt(div.querySelector('.block-size').value) || 100,
                allocated: false
            });
        }

        return blocks;
    }

    // Get process sizes
    function getProcessSizes() {
        const processDivs = processSizeInputs.getElementsByClassName('process-size-input');
        const sizes = [];

        for (let i = 0; i < processDivs.length; i++) {
            const div = processDivs[i];
            sizes.push(parseInt(div.querySelector('.process-size').value) || 50);
        }

        return sizes;
    }

    // Calculate scheduling based on algorithm
    function calculateScheduling(processes, algorithm, quantum) {
        let result = {
            ganttChart: [],
            statistics: {
                avgWaitingTime: 0,
                avgTurnaroundTime: 0
            }
        };

        switch (algorithm) {
            case 'fcfs':
                result = calculateFCFS(processes);
                break;
            case 'sjf':
                result = calculateSJF(processes);
                break;
            case 'priority':
                result = calculatePriority(processes);
                break;
            case 'rr':
                result = calculateRoundRobin(processes, quantum);
                break;
        }

        return result;
    }

    // FCFS Algorithm
    function calculateFCFS(processes) {
        const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        const ganttChart = [];
        let currentTime = 0;
        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;

        sortedProcesses.forEach(process => {
            if (currentTime < process.arrivalTime) {
                ganttChart.push({ process: 'IDLE', start: currentTime, end: process.arrivalTime });
                currentTime = process.arrivalTime;
            }

            const waitingTime = currentTime - process.arrivalTime;
            const turnaroundTime = waitingTime + process.burstTime;

            ganttChart.push({
                process: `P${process.id}`,
                start: currentTime,
                end: currentTime + process.burstTime
            });

            currentTime += process.burstTime;
            totalWaitingTime += waitingTime;
            totalTurnaroundTime += turnaroundTime;
        });

        return {
            ganttChart,
            statistics: {
                avgWaitingTime: totalWaitingTime / processes.length,
                avgTurnaroundTime: totalTurnaroundTime / processes.length
            }
        };
    }

    // SJF Algorithm
    function calculateSJF(processes) {
        const ganttChart = [];
        let currentTime = 0;
        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;
        let remainingProcesses = [...processes];
        let completedProcesses = [];

        while (remainingProcesses.length > 0 || completedProcesses.length < processes.length) {
            const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
            
            if (availableProcesses.length === 0) {
                const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
                ganttChart.push({ process: 'IDLE', start: currentTime, end: nextArrival });
                currentTime = nextArrival;
                continue;
            }

            const nextProcess = availableProcesses.reduce((min, p) => 
                p.burstTime < min.burstTime ? p : min, availableProcesses[0]);

            ganttChart.push({
                process: `P${nextProcess.id}`,
                start: currentTime,
                end: currentTime + nextProcess.burstTime
            });

            const waitingTime = currentTime - nextProcess.arrivalTime;
            const turnaroundTime = waitingTime + nextProcess.burstTime;

            totalWaitingTime += waitingTime;
            totalTurnaroundTime += turnaroundTime;

            currentTime += nextProcess.burstTime;
            remainingProcesses = remainingProcesses.filter(p => p.id !== nextProcess.id);
            completedProcesses.push(nextProcess);
        }

        return {
            ganttChart,
            statistics: {
                avgWaitingTime: totalWaitingTime / processes.length,
                avgTurnaroundTime: totalTurnaroundTime / processes.length
            }
        };
    }

    // Priority Scheduling Algorithm
    function calculatePriority(processes) {
        const ganttChart = [];
        let currentTime = 0;
        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;
        let remainingProcesses = [...processes];
        let completedProcesses = [];

        while (remainingProcesses.length > 0 || completedProcesses.length < processes.length) {
            const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
            
            if (availableProcesses.length === 0) {
                const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
                ganttChart.push({ process: 'IDLE', start: currentTime, end: nextArrival });
                currentTime = nextArrival;
                continue;
            }

            const nextProcess = availableProcesses.reduce((min, p) => 
                p.priority < min.priority ? p : min, availableProcesses[0]);

            ganttChart.push({
                process: `P${nextProcess.id}`,
                start: currentTime,
                end: currentTime + nextProcess.burstTime
            });

            const waitingTime = currentTime - nextProcess.arrivalTime;
            const turnaroundTime = waitingTime + nextProcess.burstTime;

            totalWaitingTime += waitingTime;
            totalTurnaroundTime += turnaroundTime;

            currentTime += nextProcess.burstTime;
            remainingProcesses = remainingProcesses.filter(p => p.id !== nextProcess.id);
            completedProcesses.push(nextProcess);
        }

        return {
            ganttChart,
            statistics: {
                avgWaitingTime: totalWaitingTime / processes.length,
                avgTurnaroundTime: totalTurnaroundTime / processes.length
            }
        };
    }

    // Round Robin Algorithm
    function calculateRoundRobin(processes, quantum) {
        const ganttChart = [];
        let currentTime = 0;
        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;
        let remainingProcesses = [...processes].map(p => ({...p, remainingTime: p.burstTime}));
        let completedProcesses = [];

        while (remainingProcesses.length > 0 || completedProcesses.length < processes.length) {
            const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
            
            if (availableProcesses.length === 0) {
                const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
                ganttChart.push({ process: 'IDLE', start: currentTime, end: nextArrival });
                currentTime = nextArrival;
                continue;
            }

            const currentProcess = availableProcesses[0];
            const executionTime = Math.min(quantum, currentProcess.remainingTime);

            ganttChart.push({
                process: `P${currentProcess.id}`,
                start: currentTime,
                end: currentTime + executionTime
            });

            currentProcess.remainingTime -= executionTime;
            currentTime += executionTime;

            if (currentProcess.remainingTime === 0) {
                const waitingTime = currentTime - currentProcess.arrivalTime - currentProcess.burstTime;
                const turnaroundTime = currentTime - currentProcess.arrivalTime;

                totalWaitingTime += waitingTime;
                totalTurnaroundTime += turnaroundTime;

                remainingProcesses = remainingProcesses.filter(p => p.id !== currentProcess.id);
                completedProcesses.push(currentProcess);
            } else {
                remainingProcesses = remainingProcesses.filter(p => p.id !== currentProcess.id);
                remainingProcesses.push(currentProcess);
            }
        }

        return {
            ganttChart,
            statistics: {
                avgWaitingTime: totalWaitingTime / processes.length,
                avgTurnaroundTime: totalTurnaroundTime / processes.length
            }
        };
    }

    // Calculate disk scheduling
    function calculateDiskScheduling(requests, algorithm, head) {
        let sequence = [head];
        let totalHeadMovement = 0;
        const MAX_CYLINDERS = 200; // Maximum number of cylinders

        switch (algorithm) {
            case 'fcfs':
                sequence = [head, ...requests];
                for (let i = 1; i < sequence.length; i++) {
                    totalHeadMovement += Math.abs(sequence[i] - sequence[i-1]);
                }
                break;

            case 'sstf':
                let remainingRequests = [...requests];
                let currentHead = head;

                while (remainingRequests.length > 0) {
                    const distances = remainingRequests.map(request => 
                        Math.abs(request - currentHead));
                    const minIndex = distances.indexOf(Math.min(...distances));
                    
                    const nextRequest = remainingRequests[minIndex];
                    totalHeadMovement += Math.abs(nextRequest - currentHead);
                    
                    sequence.push(nextRequest);
                    currentHead = nextRequest;
                    remainingRequests.splice(minIndex, 1);
                }
                break;

            case 'scan':
                const sortedRequests = [...requests].sort((a, b) => a - b);
                const lowerRequests = sortedRequests.filter(r => r < head);
                const upperRequests = sortedRequests.filter(r => r >= head);

                // Move to lower requests first
                for (let i = lowerRequests.length - 1; i >= 0; i--) {
                    sequence.push(lowerRequests[i]);
                }
                // Move to 0
                if (lowerRequests.length > 0) {
                    sequence.push(0);
                }
                // Move to upper requests
                sequence.push(...upperRequests);

                // Calculate head movement
                for (let i = 1; i < sequence.length; i++) {
                    totalHeadMovement += Math.abs(sequence[i] - sequence[i-1]);
                }
                break;

            case 'cscan':
                const sortedRequests2 = [...requests].sort((a, b) => a - b);
                const lowerRequests2 = sortedRequests2.filter(r => r < head);
                const upperRequests2 = sortedRequests2.filter(r => r >= head);

                // Move to upper requests first
                sequence.push(...upperRequests2);
                // Move to MAX_CYLINDERS
                sequence.push(MAX_CYLINDERS);
                // Move to 0
                sequence.push(0);
                // Move to lower requests
                sequence.push(...lowerRequests2);

                // Calculate head movement
                for (let i = 1; i < sequence.length; i++) {
                    totalHeadMovement += Math.abs(sequence[i] - sequence[i-1]);
                }
                break;

            case 'look':
                const sortedRequests3 = [...requests].sort((a, b) => a - b);
                const lowerRequests3 = sortedRequests3.filter(r => r < head);
                const upperRequests3 = sortedRequests3.filter(r => r >= head);

                // Move to lower requests first
                for (let i = lowerRequests3.length - 1; i >= 0; i--) {
                    sequence.push(lowerRequests3[i]);
                }
                // Move to upper requests
                sequence.push(...upperRequests3);

                // Calculate head movement
                for (let i = 1; i < sequence.length; i++) {
                    totalHeadMovement += Math.abs(sequence[i] - sequence[i-1]);
                }
                break;

            case 'clook':
                const sortedRequests4 = [...requests].sort((a, b) => a - b);
                const lowerRequests4 = sortedRequests4.filter(r => r < head);
                const upperRequests4 = sortedRequests4.filter(r => r >= head);

                // Move to upper requests first
                sequence.push(...upperRequests4);
                // Move to lower requests
                sequence.push(...lowerRequests4);

                // Calculate head movement
                for (let i = 1; i < sequence.length; i++) {
                    totalHeadMovement += Math.abs(sequence[i] - sequence[i-1]);
                }
                break;
        }

        return {
            sequence,
            totalHeadMovement,
            maxCylinders: MAX_CYLINDERS
        };
    }

    // Calculate memory allocation
    function calculateMemoryAllocation(blocks, processSizes, algorithm) {
        const allocations = [];
        let totalFragmentation = 0;
        const availableBlocks = [...blocks];

        switch (algorithm) {
            case 'firstFit':
                processSizes.forEach((size, index) => {
                    const blockIndex = availableBlocks.findIndex(block => 
                        !block.allocated && block.size >= size);

                    if (blockIndex !== -1) {
                        const block = availableBlocks[blockIndex];
                        block.allocated = true;
                        allocations.push({
                            processId: index + 1,
                            blockId: block.id,
                            size: size,
                            fragmentation: block.size - size
                        });
                        totalFragmentation += block.size - size;
                    } else {
                        allocations.push({
                            processId: index + 1,
                            blockId: null,
                            size: size,
                            fragmentation: 0
                        });
                    }
                });
                break;

            case 'bestFit':
                processSizes.forEach((size, index) => {
                    const suitableBlocks = availableBlocks.filter(block => 
                        !block.allocated && block.size >= size);
                    
                    if (suitableBlocks.length > 0) {
                        const bestBlock = suitableBlocks.reduce((min, block) => 
                            block.size < min.size ? block : min);
                        
                        const blockIndex = availableBlocks.findIndex(b => b.id === bestBlock.id);
                        availableBlocks[blockIndex].allocated = true;
                        
                        allocations.push({
                            processId: index + 1,
                            blockId: bestBlock.id,
                            size: size,
                            fragmentation: bestBlock.size - size
                        });
                        totalFragmentation += bestBlock.size - size;
                    } else {
                        allocations.push({
                            processId: index + 1,
                            blockId: null,
                            size: size,
                            fragmentation: 0
                        });
                    }
                });
                break;
        }

        return {
            allocations,
            totalFragmentation
        };
    }

    // Display results with step-by-step animation
    function displayResults(result) {
        results.classList.remove('hidden');
        ganttChart.innerHTML = '';
        statistics.innerHTML = '';

        // Create timeline
        const timeline = document.createElement('div');
        timeline.className = 'timeline';
        ganttChart.appendChild(timeline);

        // Create process queue visualization
        const processQueue = document.createElement('div');
        processQueue.className = 'process-queue';
        ganttChart.appendChild(processQueue);

        // Display Gantt Chart with step-by-step animation
        const ganttContainer = document.createElement('div');
        ganttContainer.className = 'gantt-container';

        // Add timeline markers
        result.ganttChart.forEach((item, index) => {
            const marker = document.createElement('div');
            marker.className = 'timeline-marker';
            marker.style.left = `${(index * 100) / result.ganttChart.length}%`;
            timeline.appendChild(marker);

            const label = document.createElement('div');
            label.className = 'timeline-label';
            label.style.left = `${(index * 100) / result.ganttChart.length}%`;
            label.textContent = item.start;
            timeline.appendChild(label);
        });

        // Add final time marker
        const finalMarker = document.createElement('div');
        finalMarker.className = 'timeline-marker';
        finalMarker.style.left = '100%';
        timeline.appendChild(finalMarker);

        const finalLabel = document.createElement('div');
        finalLabel.className = 'timeline-label';
        finalLabel.style.left = '100%';
        finalLabel.textContent = result.ganttChart[result.ganttChart.length - 1].end;
        timeline.appendChild(finalLabel);

        // Animate process execution step by step
        let delay = 0;
        result.ganttChart.forEach((item, index) => {
            // Add to process queue
            setTimeout(() => {
                const queueItem = document.createElement('div');
                queueItem.className = 'queue-item';
                queueItem.textContent = item.process;
                processQueue.appendChild(queueItem);
            }, delay);

            // Add to Gantt chart
            setTimeout(() => {
                const processDiv = document.createElement('div');
                processDiv.className = 'gantt-process';
                processDiv.style.width = `${(item.end - item.start) * 50}px`;
                processDiv.textContent = item.process;
                processDiv.setAttribute('data-time', item.start);
                processDiv.setAttribute('data-end', item.end);
                
                processDiv.addEventListener('mouseover', () => {
                    processDiv.style.transform = 'scale(1.05) translateY(-5px)';
                    processDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                });
                
                processDiv.addEventListener('mouseout', () => {
                    processDiv.style.transform = 'scale(1)';
                    processDiv.style.boxShadow = 'none';
                });

                ganttContainer.appendChild(processDiv);

                // Remove from queue
                const queueItems = processQueue.getElementsByClassName('queue-item');
                if (queueItems.length > 0) {
                    queueItems[0].remove();
                }

                // Show statistics after last process
                if (index === result.ganttChart.length - 1) {
                    setTimeout(() => {
                        statistics.innerHTML = `
                            <div class="stat-row">
                                <span>Average Waiting Time:</span>
                                <span>${result.statistics.avgWaitingTime.toFixed(2)}</span>
                            </div>
                            <div class="stat-row">
                                <span>Average Turnaround Time:</span>
                                <span>${result.statistics.avgTurnaroundTime.toFixed(2)}</span>
                            </div>
                        `;
                    }, 500);
                }
            }, delay + 500);

            delay += 1000;
        });

        ganttChart.appendChild(ganttContainer);
    }

    // Display disk scheduling results with step-by-step animation
    function displayDiskResults(result) {
        results.classList.remove('hidden');
        ganttChart.innerHTML = '';
        statistics.innerHTML = '';

        // Create cylinder visualization
        const cylinderContainer = document.createElement('div');
        cylinderContainer.className = 'cylinder-container';
        
        // Create cylinder scale
        const cylinderScale = document.createElement('div');
        cylinderScale.className = 'cylinder-scale';
        // Add vertical label for cylinders
        const cylinderLabel = document.createElement('div');
        cylinderLabel.style.position = 'absolute';
        cylinderLabel.style.top = '0';
        cylinderLabel.style.left = '50%';
        cylinderLabel.style.transform = 'translate(-50%, -100%) rotate(-90deg)';
        cylinderLabel.style.fontWeight = 'bold';
        cylinderLabel.style.fontSize = '14px';
        cylinderLabel.style.color = '#2196F3';
        cylinderLabel.textContent = 'Cylinders';
        cylinderScale.appendChild(cylinderLabel);
        for (let i = 0; i <= result.maxCylinders; i += 20) {
            const marker = document.createElement('div');
            marker.className = 'cylinder-marker';
            marker.textContent = i;
            marker.style.bottom = `${(i / result.maxCylinders) * 100}%`;
            cylinderScale.appendChild(marker);
        }
        cylinderContainer.appendChild(cylinderScale);

        // Create head movement visualization
        const movementContainer = document.createElement('div');
        movementContainer.className = 'movement-container';

        // Animate head movement step by step
        let delay = 0;
        result.sequence.forEach((position, index) => {
            setTimeout(() => {
                const positionDiv = document.createElement('div');
                positionDiv.className = 'position-marker';
                positionDiv.textContent = position + ' cyl';
                positionDiv.style.bottom = `${(position / result.maxCylinders) * 100}%`;
                movementContainer.appendChild(positionDiv);

                if (index < result.sequence.length - 1) {
                    const line = document.createElement('div');
                    line.className = 'head-movement';
                    const startPos = (position / result.maxCylinders) * 100;
                    const endPos = (result.sequence[index + 1] / result.maxCylinders) * 100;
                    const height = Math.abs(endPos - startPos);
                    line.style.height = `${height}%`;
                    line.style.bottom = `${Math.min(startPos, endPos)}%`;
                    movementContainer.appendChild(line);
                }

                // Show statistics after last position
                if (index === result.sequence.length - 1) {
                    setTimeout(() => {
                        statistics.innerHTML = `
                            <div class="stat-row">
                                <span>Total Head Movement (Cylinders):</span>
                                <span>${result.totalHeadMovement} cylinders</span>
                            </div>
                            <div class="stat-row">
                                <span>Average Seek Time (Cylinders):</span>
                                <span>${(result.totalHeadMovement / (result.sequence.length - 1)).toFixed(2)} cylinders</span>
                            </div>
                        `;
                    }, 500);
                }
            }, delay);

            delay += 1000;
        });

        cylinderContainer.appendChild(movementContainer);
        ganttChart.appendChild(cylinderContainer);
    }

    // Display memory allocation results with step-by-step animation
    function displayMemoryResults(result) {
        results.classList.remove('hidden');
        ganttChart.innerHTML = '';
        statistics.innerHTML = '';

        const allocationContainer = document.createElement('div');
        allocationContainer.className = 'allocation-container';

        // Animate allocations step by step
        let delay = 0;
        result.allocations.forEach((allocation, index) => {
            setTimeout(() => {
                const allocationDiv = document.createElement('div');
                allocationDiv.className = 'allocation-item';
                allocationDiv.innerHTML = `
                    <div class="process-info">
                        <span>Process ${allocation.processId}</span>
                        <span>Size: ${allocation.size}</span>
                    </div>
                    <div class="block-info">
                        ${allocation.blockId ? 
                            `Block ${allocation.blockId} (Fragmentation: ${allocation.fragmentation})` :
                            'Not Allocated'}
                    </div>
                `;
                allocationContainer.appendChild(allocationDiv);

                // Show statistics after last allocation
                if (index === result.allocations.length - 1) {
                    setTimeout(() => {
                        statistics.innerHTML = `
                            <div class="stat-row">
                                <span>Total Fragmentation:</span>
                                <span>${result.totalFragmentation}</span>
                            </div>
                        `;
                    }, 500);
                }
            }, delay);

            delay += 1000;
        });

        ganttChart.appendChild(allocationContainer);
    }

    // Initialize the page
    handleSchedulingTypeChange();
    handleProcessCountChange();
    handleRequestCountChange();
    handleBlockCountChange();
    handleProcessSizeCountChange();
}); 