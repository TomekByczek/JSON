class SumEnergy {
    startTime;
    endTime;
    energy;
    maxEnergy;
    constructor(startTime, endTime, energy, maxEnergy, maxPower) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.energy = energy;
        this.maxEnergy = maxEnergy;
        this.maxPower = maxPower;
    }
}

class PvData {
    id;
    creationTime;
    current;
    voltage;
    power;
}
const SECOND = 1000;

var testDataString = '{"battery":[{"id":25999,"creationTime":"2023-03-02T07:30:47.000Z","current":1.2,"temp":1,"voltage":25},{"id":26000,"creationTime":"2023-03-02T07:31:46.000Z","current":1.2,"temp":1,"voltage":25},{"id":26001,"creationTime":"2023-03-02T07:32:45.000Z","current":1.3,"temp":1,"voltage":25},{"id":26002,"creationTime":"2023-03-02T07:33:44.000Z","current":1.3,"temp":1,"voltage":25},{"id":26003,"creationTime":"2023-03-02T07:34:43.000Z","current":1.4,"temp":1,"voltage":25},{"id":26004,"creationTime":"2023-03-02T07:35:42.000Z","current":1.4,"temp":1,"voltage":25},{"id":26005,"creationTime":"2023-03-02T07:37:40.000Z","current":1.5,"temp":1,"voltage":25},{"id":26006,"creationTime":"2023-03-02T07:38:39.000Z","current":1.7,"temp":1,"voltage":25.1},{"id":26007,"creationTime":"2023-03-02T07:39:38.000Z","current":1.8,"temp":1,"voltage":25.1},{"id":26008,"creationTime":"2023-03-02T07:40:36.000Z","current":1.8,"temp":1,"voltage":25},{"id":26009,"creationTime":"2023-03-02T07:41:35.000Z","current":1.8,"temp":1,"voltage":25.1},{"id":26010,"creationTime":"2023-03-02T07:42:34.000Z","current":1.8,"temp":1,"voltage":25.1},{"id":26011,"creationTime":"2023-03-02T07:43:33.000Z","current":1.9,"temp":1,"voltage":25.1},{"id":26012,"creationTime":"2023-03-02T07:44:32.000Z","current":1.9,"temp":1,"voltage":25.1}],"pv":[{"id":27257,"creationTime":"2023-03-02T07:30:47.000Z","current":1.3,"voltage":27.3,"power":35.5},{"id":27258,"creationTime":"2023-03-02T07:31:46.000Z","current":1.3,"voltage":27.3,"power":35.5},{"id":27259,"creationTime":"2023-03-02T07:32:45.000Z","current":1.3,"voltage":26.9,"power":35},{"id":27260,"creationTime":"2023-03-02T07:33:44.000Z","current":1.4,"voltage":26.9,"power":37.7},{"id":27261,"creationTime":"2023-03-02T07:34:43.000Z","current":1.4,"voltage":26.6,"power":37.2},{"id":27262,"creationTime":"2023-03-02T07:35:42.000Z","current":1.5,"voltage":26.8,"power":40.2},{"id":27263,"creationTime":"2023-03-02T07:37:39.000Z","current":1.6,"voltage":26.8,"power":42.9},{"id":27264,"creationTime":"2023-03-02T07:38:38.000Z","current":1.5,"voltage":32.9,"power":49.3},{"id":27265,"creationTime":"2023-03-02T07:39:37.000Z","current":1.5,"voltage":32.9,"power":49.3},{"id":27266,"creationTime":"2023-03-02T07:40:36.000Z","current":1.5,"voltage":32.8,"power":49.2},{"id":27267,"creationTime":"2023-03-02T07:41:35.000Z","current":1.6,"voltage":32.8,"power":52.5},{"id":27268,"creationTime":"2023-03-02T07:42:34.000Z","current":1.6,"voltage":32.7,"power":52.3},{"id":27269,"creationTime":"2023-03-02T07:43:33.000Z","current":1.6,"voltage":32.7,"power":52.3},{"id":27270,"creationTime":"2023-03-02T07:44:32.000Z","current":1.6,"voltage":32.8,"power":52.5}]}';
var testData = JSON.parse(testDataString);

function calculateEnergy(pvData) {
    const fiveMinutes = SECOND * 60 * 5;
    const oneHour = SECOND * 60 * 60;
    const oneMinute = SECOND * 60;
    var kWhEnergy = 0;
    var kWhEnergyMax = 0;
    var sumEnergy = 0;
    var powerArray = []
    for (var i = 0; i < pvData.length - 1; i++) {
        powerArray.push(pvData[i].power)
        var timeDiff = (new Date(pvData[i + 1].creationTime) - new Date(pvData[i].creationTime))
        if (fiveMinutes > timeDiff && timeDiff > 0) {
            kWhEnergy = (timeDiff / oneHour) * (pvData[i].voltage * pvData[i].current / 1000);
            sumEnergy = sumEnergy + kWhEnergy;
            if (kWhEnergyMax < kWhEnergy / (timeDiff / oneMinute)) {
                kWhEnergyMax = kWhEnergy / (timeDiff / oneMinute);
            }
        }
        else {
            kWhEnergy = oneMinute / oneHour * pvData[i].voltage * pvData[i].current / 1000;
            sumEnergy = sumEnergy + kWhEnergy;
            if (kWhEnergyMax < kWhEnergy) {
                kWhEnergyMax = kWhEnergy;
            }
        }
        var powerArraySorted = powerArray.sort()
    }

    var wynik = new SumEnergy(pvData[0].creationTime, pvData[pvData.length - 1].creationTime, sumEnergy.toFixed(3), kWhEnergyMax.toFixed(3), powerArraySorted[powerArraySorted.length - 1]);
    //wynik.startTime = pvData[0].creationTime;
    //wynik.endTime = pvData[pvData.length - 1].creationTime;
    //wynik.energy = sumEnergy;
    console.log(wynik);
}
calculateEnergy(testData.pv);