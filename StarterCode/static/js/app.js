
function init () {
    d3.json("samples.json").then(({names})=> {
        console.log(names);
        names.forEach(name => {
            d3.select("#selDataset").append("option").text(name)
        });
        var sampleData = names[0]
        Charts(sampleData);
        MetaData(sampleData);
    });
};
function optionChanged(newSample) {
    Charts (newSample);
    MetaData(newSample);
};

function MetaData (sample) {
    d3.json("samples.json").then(({metadata}) => {
        console.log(metadata);
    var metaID = metadata.filter(sampleID => sampleID.id == sample);
    var info = metaID[0];

    var dropdown = d3.select("#sample-metadata");

    dropdown.html("");

    Object.entries(info).forEach(([key,value])=> {
        dropdown.append("h6").text(`${key}: ${value}`);
    });
    });
}

function Charts(sample) {
    d3.json("samples.json").then(({samples})=> {
        console.log(samples);
    var sampleID = samples.filter(sampleID => sampleID.id == sample);
    var info = sampleID[0];

    var otu_ids = info.otu_ids;
    var otu_labels = info.otu_labels;
    var sample_values = info.sample_values;

    var layout = {
        hovermode: "closest",
        xaxis: {title: "OTU ID"}
    };
    var data = [ {
        x: otu_ids,
        y: sample_values,
        mode: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        },
        text: otu_labels,
    }];
    Plotly.newPlot("bubble", data, layout);

    var HorizontalY = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
    var data = [{
        y: HorizontalY,
        x: sample_values.slice(0,10).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
    }];
    Plotly.newPlot("bar", data)
    });
    d3.json("samples.json").then(({metadata})=> {
        console.log(metadata);
    var sampleID = metadata.filter(sampleID => sampleID.id == sample);
    var info = sampleID[0];
    var washfreq = info.wfreq
    console.log(washfreq)
    var layout = {width: 600, height: 450, margin: { t: 0, b: 0 }};
    var data = [{
        domain: info,
        value: washfreq,
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: {range: [null, 9]},
        },
        title: {text: "Belly Button Washing Frequency"},
        }]
        Plotly.newPlot("gauge", data,layout)
    });


        
}
init();