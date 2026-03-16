import ko from "knockout";

const viewModel = {
    text: ko.observable("Hello, world!")
};

ko.applyBindings(viewModel);
